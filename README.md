# Crucio — crucify the interview

> MPA 2026 — Agentic AI startup project · Universitatea din București

Free-text Java interview prep cu evaluare AI. Doi agenți (Evaluator + Coach) construiți pe Vercel AI SDK + Gemini 2.5 Flash, cu input vocal prin Web Speech API.

## Livrabile MPA

| # | Cerință | Link |
|---|---|---|
| 1 | Business Foundation | [docs/Crucio_Business_Foundation.docx](docs/Crucio_Business_Foundation.docx) · live: `/business-foundation` |
| 2 | MVP cu 2+ agenți | rulează local cu `npm run dev` → `/problems` |
| 3 | Landing page | rută `/` |
| 4 | Pitch deck | [docs/Crucio_Pitch.pptx](docs/Crucio_Pitch.pptx) · live: `/pitch` |

## Run local

\`\`\`bash
npm install
cp .env.example .env   # adaugă cheia Gemini gratis: https://aistudio.google.com/apikey
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
\`\`\`

http://localhost:3000

## Stack

Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui · Prisma 7 + SQLite · Auth.js v5 · Vercel AI SDK 6 + Google Gemini · Web Speech API
