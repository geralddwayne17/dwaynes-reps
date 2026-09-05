export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY no está configurada en el servidor.' });
    return;
  }

  const { meta, nivel, dias, equipo, lesiones, edad } = req.body || {};

  const prompt = `Eres un entrenador personal experto. Genera una rutina de entrenamiento semanal en formato JSON puro (sin markdown, sin backticks, solo el objeto JSON) para esta persona:

- Meta: ${meta}
- Nivel: ${nivel}
- Días disponibles: ${dias}
- Equipo: ${equipo}
- Lesiones/limitaciones: ${lesiones}
- Edad: ${edad}

Responde SOLO con este formato JSON exacto, nada más:
{
  "titulo": "string breve y motivador para el plan",
  "resumen": "1-2 frases explicando el enfoque del plan",
  "dias": [
    {
      "nombre": "Día 1 - Nombre del enfoque (ej: Tren superior)",
      "ejercicios": [
        {"nombre": "string", "series_reps": "ej: 4x10", "nota": "descanso o tip breve, opcional"}
      ]
    }
  ]
}

Incluye tantos objetos en "dias" como el número de días disponibles indica. Cada día debe tener entre 5 y 7 ejercicios. Si hay lesiones, evita ejercicios que las agraven y dilo brevemente en la nota del ejercicio relevante.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || 'Error llamando a Claude.' });
      return;
    }

    const textBlock = data.content.find(b => b.type === 'text');
    let raw = textBlock ? textBlock.text : '{}';
    raw = raw.replace(/```json|```/g, '').trim();
    const plan = JSON.parse(raw);

    res.status(200).json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo generar la rutina.' });
  }
}
