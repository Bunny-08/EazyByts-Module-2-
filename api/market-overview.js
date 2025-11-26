import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a brief, professional market sentiment summary for the Indian Equity Market (NIFTY/SENSEX) for today. Focus on sector performance (IT, Banking, Auto). Max 2 sentences."
    });

    res.status(200).json({ text: response?.text || 'Market sentiment data unavailable.' });
  } catch (err) {
    console.error('market-overview error', err);
    res.status(500).json({ error: 'Market overview error' });
  }
}
