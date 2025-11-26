import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

app.post('/api/stock-analysis', async (req, res) => {
  try {
    const { symbol, price } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as a senior financial analyst. Provide a concise technical analysis for ${symbol} currently trading at ₹${price}. Mention key support/resistance levels or sector trends relevant to the Indian market. Keep the response under 40 words and professional.`,
    });
    res.json({ text: response.text || 'Analysis data unavailable.' });
  } catch (err) {
    console.error('stock-analysis error', err);
    res.status(500).json({ error: 'Analysis service error' });
  }
});

app.get('/api/market-overview', async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a brief, professional market sentiment summary for the Indian Equity Market (NIFTY/SENSEX) for today. Focus on sector performance (IT, Banking, Auto). Max 2 sentences.",
    });
    res.json({ text: response.text || 'Market sentiment data unavailable.' });
  } catch (err) {
    console.error('market-overview error', err);
    res.status(500).json({ error: 'Market overview error' });
  }
});

app.post('/api/portfolio-advice', async (req, res) => {
  try {
    const { holdings = [], balance = 0 } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Review this portfolio composition: [${(holdings || []).join(', ') || 'Cash only'}]. Cash reserve: ₹${balance}. Provide one strategic recommendation regarding diversification or position sizing. Keep it strictly professional.`,
    });
    res.json({ text: response.text || 'Advisory service unavailable.' });
  } catch (err) {
    console.error('portfolio-advice error', err);
    res.status(500).json({ error: 'Portfolio advice error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
