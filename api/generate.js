module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY no está configurada en el servidor.' });
    return;
  }

  const { meta, nivel, dias, equipo, lesiones, edad, lang, plan } = req.body || {};
  const isEnglish = lang === 'en';
  const includeNutrition = plan === 'nutrition' || plan === 'coaching';

  const nutritionBlockEs = `,
  "nutricion": {
    "calorias": "número estimado de calorías diarias (ej: 2200 kcal)",
    "proteina_g": "gramos de proteína diarios (ej: 150g)",
    "carbohidratos_g": "gramos de carbohidratos diarios (ej: 220g)",
    "grasas_g": "gramos de grasa diarios (ej: 70g)",
    "notas": "1-2 frases con consejos generales de alimentación para esta meta",
    "menu_dia": [
      {"comida": "Desayuno", "descripcion": "ejemplo de comida con la cantidad exacta de cada alimento en onzas o gramos y medidas caseras (ej: 6 oz de pechuga de pollo, 1 taza de arroz, 1/2 aguacate)"},
      {"comida": "Almuerzo", "descripcion": "..."},
      {"comida": "Cena", "descripcion": "..."},
      {"comida": "Snack", "descripcion": "..."}
    ]
  }`;

  const nutritionBlockEn = `,
  "nutricion": {
    "calorias": "estimated daily calories (e.g: 2200 kcal)",
    "proteina_g": "daily protein grams (e.g: 150g)",
    "carbohidratos_g": "daily carb grams (e.g: 220g)",
    "grasas_g": "daily fat grams (e.g: 70g)",
    "notas": "1-2 sentences with general nutrition advice for this goal",
    "menu_dia": [
      {"comida": "Breakfast", "descripcion": "example meal with the exact amount of each food in ounces or grams and household measures (e.g: 6 oz chicken breast, 1 cup rice, 1/2 avocado)"},
      {"comida": "Lunch", "descripcion": "..."},
      {"comida": "Dinner", "descripcion": "..."},
      {"comida": "Snack", "descripcion": "..."}
    ]
  }`;

  const prompt = isEnglish
    ? `You are an expert personal trainer${includeNutrition ? ' and nutrition coach' : ''}. Generate a weekly workout routine${includeNutrition ? ' plus a daily nutrition guide' : ''} in pure JSON format (no markdown, no backticks, just the JSON object) for this person. Respond entirely in English.

- Goal: ${meta}
- Level: ${nivel}
- Available days: ${dias}
- Equipment: ${equipo}
- Injuries/limitations: ${lesiones}
- Age: ${edad}

Respond ONLY with this exact JSON format, nothing else:
{
  "titulo": "short, motivating title for the plan (in English)",
  "resumen": "1-2 sentences explaining the plan's approach (in English)",
  "dias": [
    {
      "nombre": "Day 1 - Focus name (e.g: Upper body)",
      "ejercicios": [
        {"nombre": "string", "series_reps": "e.g: 4x10", "descanso": "rest time between sets, e.g: 60-90 sec", "modificacion": "an easier or alternative version of this exercise for someone who can't perform it (injury, no equipment, too advanced)", "nota": "brief extra tip, optional"}
      ]
    }
  ]${includeNutrition ? nutritionBlockEn : ''}
}

Include as many objects in "dias" as the number of available days indicates. Each day must have 5 to 7 exercises. If there are injuries, avoid exercises that would aggravate them and mention it briefly in the relevant exercise's note.${includeNutrition ? ' Base the nutrition numbers on the person\'s goal, age, and activity level implied by their training days.' : ''}`
    : `Eres un entrenador personal experto${includeNutrition ? ' y coach de nutrición' : ''}. Genera una rutina de entrenamiento semanal${includeNutrition ? ' más una guía de alimentación diaria' : ''} en formato JSON puro (sin markdown, sin backticks, solo el objeto JSON) para esta persona:

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
        {"nombre": "string", "series_reps": "ej: 4x10", "descanso": "tiempo de descanso entre series, ej: 60-90 seg", "modificacion": "una versión más fácil o alterna de este ejercicio para alguien que no pueda hacerlo (lesión, sin equipo, muy avanzado)", "nota": "tip extra breve, opcional"}
      ]
    }
  ]${includeNutrition ? nutritionBlockEs : ''}
}

Incluye tantos objetos en "dias" como el número de días disponibles indica. Cada día debe tener entre 5 y 7 ejercicios. Si hay lesiones, evita ejercicios que las agraven y dilo brevemente en la nota del ejercicio relevante.${includeNutrition ? ' Basa los números de nutrición en la meta, edad y nivel de actividad implícito por los días de entrenamiento de la persona.' : ''}`;

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
        max_tokens: 4000,
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
    const planResult = JSON.parse(raw);

    res.status(200).json({ plan: planResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo generar la rutina.' });
  }
}
