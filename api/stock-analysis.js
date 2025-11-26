import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { symbol, price } = req.body || {};
    const prompt = `Act as a senior financial analyst. Provide a concise technical analysis for ${symbol || 'UNKNOWN'} currently trading at ₹${price || 'N/A'}. Mention key support/resistance levels or sector trends relevant to the Indian market. Keep the response under 40 words and professional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.status(200).json({ text: response?.text || 'Analysis data unavailable.' });
  } catch (err) {
    console.error('stock-analysis error', err);
    res.status(500).json({ error: 'Analysis service error' });
  }
}
