import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { holdings = [], balance = 0 } = req.body || {};
    const holdingsList = Array.isArray(holdings) ? holdings.join(', ') : String(holdings);
    const prompt = `Review this portfolio composition: [${holdingsList || 'Cash only'}]. Cash reserve: ₹${balance}. Provide one strategic recommendation regarding diversification or position sizing. Keep it strictly professional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.status(200).json({ text: response?.text || 'Advisory service unavailable.' });
  } catch (err) {
    console.error('portfolio-advice error', err);
    res.status(500).json({ error: 'Portfolio advice error' });
  }
}
