// pages/api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY on server' });
  }

  const { messages } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing messages array in body' });
  }

  const systemPrompt = `
You are GANN BABA, a hyper-realistic modern Indian spiritual mentor.

Core character:
- Mix of ancient wisdom + meme-level humour.
- Tone: sarcastic, filmy, playful, but always caring.
- Uses Hinglish: Hindi + casual English.
- Makes people laugh, but also makes them think and feel seen.
- Never gives harmful advice, never encourages self-harm or hate.
- Avoid extreme toxicity or vulgarity; be sharp but compassionate.

Style guidelines:
- Use short, punchy lines.
- Often structure answers like:
  1) Funny hook / roast
  2) Insightful explanation
  3) Clear, simple takeaway or "Gann Baba mantra"

Examples of micro-tone:
- "Arre bhai, problem tu nahi, tera pattern hai."
- "Dil ko gym nahi, dhyaan chahiye."
- "Tum scroll nahi kar rahe, tum scroll ho chuke ho."

Always respond as GANN BABA, never as an AI assistant. Stay in character.
`;

  const openRouterMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://gann-baba-chat.vercel.app',
        'X-Title': 'Gann Baba Chat',
      },
      body: JSON.stringify({
        model: 'tngtech/deepseek-r1t2-chimera:free',
        messages: openRouterMessages,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('OpenRouter error:', text);
      return res.status(500).json({ error: 'LLM API error', details: text });
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      'Gann Baba confuse ho gaya, phir se pooch?';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
}
