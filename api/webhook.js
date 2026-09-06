const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

// Vercel: necesitamos el body "crudo" (sin parsear) para verificar la firma de Stripe
module.exports.config = {
  api: {
    bodyParser: false
  }
};

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', (chunk) => chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    console.error('Faltan variables de entorno en el webhook');
    res.status(500).send('Server misconfigured');
    return;
  }

  const stripe = new Stripe(stripeKey);
  const sb = createClient(supabaseUrl, supabaseServiceKey);

  let event;
  try {
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Firma de webhook inválida:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Mapea el ID del producto/precio de Stripe a nuestro identificador interno de plan.
  // Rellena esto con tus Price IDs reales (Stripe Dashboard > Products > cada producto > Price ID, empieza con "price_").
  const PRICE_TO_PLAN = {
    'price_1UCOJx1oj7qoBkfh8eboapVu': 'basic',
    'price_1UCOJx1oj7qoBkfhPnygBppo': 'nutrition',
    'price_1UCOJx1oj7qoBkfh4GA1K834': 'coaching',
  };

  function planFromPriceId(priceId) {
    return PRICE_TO_PLAN[priceId] || 'basic';
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id;
        if (!userId) break;

        const subscriptionId = session.subscription;
        let plan = 'basic';
        let currentPeriodEnd = null;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price?.id;
          plan = planFromPriceId(priceId);
          currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        }

        await sb.from('subscriptions').upsert({
          user_id: userId,
          plan,
          status: 'active',
          stripe_customer_id: session.customer,
          stripe_subscription_id: subscriptionId,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const priceId = subscription.items.data[0]?.price?.id;
        const plan = planFromPriceId(priceId);
        const status = subscription.status === 'trialing' ? 'trialing' : subscription.status;

        await sb.from('subscriptions')
          .update({
            plan,
            status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await sb.from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      default:
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error procesando webhook:', err);
    res.status(500).send('Internal error');
  }
};
