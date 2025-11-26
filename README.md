<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1HS8E81RsRj6yMVX-6_MpvZrqbR5GydHe

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

This project contains a Vite frontend and serverless AI endpoints for secure GenAI usage. The server endpoints live in the `api/` folder so Vercel will deploy them as Serverless Functions.

1. Create a Vercel project and link it to this GitHub repository.
2. In the Vercel dashboard add an environment variable `GEMINI_API_KEY` with your Gemini API key.
3. Build & deploy — Vercel will run `npm run build` and serve the frontend; API routes are available under `/api/*`.

Notes:
- Do NOT commit your API key to the repository. Use Vercel environment variables.
- If you want the Express server (`server/index.js`) to run instead of serverless functions, use a different host (e.g., Heroku, Render, Railway) or add a separate deployment for the server.

