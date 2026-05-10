<div align="center">

# Crucio

### *crucify the interview*

**Free-text Java interview prep cu evaluare prin agenți AI.**
Doi agenți (Evaluator + Coach) construiți pe Vercel AI SDK + Google Gemini 2.5 Flash,
cu input vocal prin Web Speech API, ELO leaderboard și rubrici curate per problemă.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square)](https://nextjs.org)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)](https://www.typescriptlang.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square)](https://tailwindcss.com)
[![Prisma 7](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square)](https://www.prisma.io)
[![Auth.js v5](https://img.shields.io/badge/Auth.js-v5-1B6FEB?style=flat-square)](https://authjs.dev)
[![Gemini 2.5 Flash](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=flat-square)](https://ai.google.dev)
[![License: Academic](https://img.shields.io/badge/license-academic-rose?style=flat-square)](#licenta--context-academic)

</div>

---

## Cuprins

- [Echipa](#echipa)
- [Context academic](#context-academic)
- [Livrabile MPA 2026](#livrabile-mpa-2026)
- [Problema pe care o rezolvăm](#problema-pe-care-o-rezolvăm)
- [Soluția — doi agenți AI](#soluția--doi-agenți-ai)
- [Arhitectura](#arhitectura)
- [Stack tehnologic](#stack-tehnologic)
- [Structura proiectului](#structura-proiectului)
- [Run local](#run-local)
- [Date demo](#date-demo)
- [Rute disponibile](#rute-disponibile)
- [Banca de probleme](#banca-de-probleme)
- [Sistemul ELO](#sistemul-elo)
- [Disclosure AI](#disclosure-ai)
- [Roadmap](#roadmap)
- [Licență și context academic](#licență-și-context-academic)

---

## Echipa

**Grupa 506 · Universitatea din București · MPA 2026**

| Membru | Grupa | Contribuție principală |
|---|---|---|
| **Ciprian Amza** | 506 | Founder / AI Lead — design agenți, prompt engineering, rubrici curate |
| **Andrei Dina** | 506 | Full-stack Engineer — Next.js, Prisma, Auth.js, API routes |
| **Esra Yapici** | 506 | Frontend / UX — Tailwind, shadcn/ui, voice UI, animații, branding |
| **Bogdan Ivan** | 506 | Java SME / Content — authoring rubrici, problem curation, ground-truth |
| **Vlad Furdui** | 506 | GTM / Marketing — landing copy, pitch, partnership outreach, business foundation |

> Distribuția rolurilor reflectă responsabilitățile individuale în cadrul proiectului. În realitate, fiecare membru a contribuit cross-functional pe partea care a avut nevoie cel mai mult la un moment dat.

---

## Context academic

Crucio este proiectul de echipă pentru cursul **MPA 2026 — Management de Produs si Antreprenoriat** (titular curs: prof. Alin Ștefănescu, alin.stefanescu@unibuc.ro). Cerința: simularea unui startup sau a unui produs nou într-o companie mare, folosind tehnologii de tip **Agentic AI** — minimum 2 agenți funcționali, MVP rulabil cu cel puțin jumătate din funcționalități implementate, plus livrabile complete de business (Business Foundation document, landing page, pitch deck).

---

## Livrabile MPA 2026

Cele patru componente cerute pentru evaluare sunt accesibile direct din acest repository și prin aplicație:

| # | Cerință | Punctaj | Locație |
|---|---|:-:|---|
| **1** | Business Foundation | 2 pct | [docs/Crucio_Business_Foundation.docx](docs/Crucio_Business_Foundation.docx) · live la ruta `/business-foundation` |
| **2** | MVP cu 2+ agenți Agentic AI | 4 pct | întregul cod sursă · run cu `npm run dev` → `/problems` |
| **3** | Landing page | 1 pct | rută `/` (root) |
| **4** | Pitch deck | 2 pct | [docs/Crucio_Pitch.pptx](docs/Crucio_Pitch.pptx) · live la ruta `/pitch` |
| **5** | Din oficiu | 1 pct | — |
| | **Total țintit** | **10 pct** | |

---

## Problema pe care o rezolvăm

> **Pregătirea pentru interviul tehnic antrenează abilitatea greșită.**

Candidații petrec luni întregi pe LeetCode rezolvând puzzle-uri algoritmice — dar interviul real cere altceva: să **explici verbal**, sub presiune, cum funcționează garbage collector-ul în JVM, sau care sunt principiile SOLID, sau diferența dintre `volatile` și `synchronized`.

LeetCode optimizează pentru *„a trecut testul automat?”*. Crucio optimizează pentru *„poți să explici asta unui senior?”* — care este, de fapt, interviul.

**Cifre care contează:**

- 73% dintre interviurile pentru roluri senior sunt conceptuale / verbale
- 3.4M+ utilizatori activi lunar pe LeetCode — antrenând unealta greșită
- 2026 este anul în care LLM-urile sunt destul de mature pentru a nota raționament tehnic free-text

---

## Soluția — doi agenți AI

Crucio rulează două bucle agentice separate, ambele cu **tool calling real** (nu doar prompting):

### Evaluator Agent

Rolul: notează un răspuns liber sau o transcriere vocală pentru o problemă dată.

```
User submits answer
       │
       ▼
Evaluator agent (Gemini 2.5 Flash, temp=0.2)
       │
       ├──► tool: get_problem_rubric(problemId)
       │     returns rubric with criteria + weights + key concepts + red flags
       │
       ├──► tool: search_user_prior_answers(userId, problemId)  [optional]
       │     returns recent submissions on same topic for pattern detection
       │
       ▼
Returns structured JSON:
  - score: 0..10000 (integer)
  - oneLine: tl;dr verdict
  - perCriterion[]: name, score 0..100, comment
  - strengths[], gaps[], studyHints[]
       │
       ▼
ELO update: K=32 standard formula
```

### Coach Agent

Rolul: analizează istoricul utilizatorului și recomandă un plan personalizat.

```
User clicks "Get my plan"
       │
       ▼
Coach agent (Gemini 2.5 Flash, temp=0.4)
       │
       ├──► tool: get_user_progress(userId)
       │     returns ELO, total submissions, last 10 attempts
       │
       ├──► tool: identify_weak_topics(userId)
       │     ranks topics by lowest avg score across recent submissions
       │
       ├──► tool: recommend_next_problems(userId, topicSlugs[])
       │     returns up to 5 unsolved problems filtered by weak topics
       │
       ▼
Returns:
  - summary: 2-3 sentences on where you stand
  - weakTopics[]: slug, name, avgScore, hint
  - recommendedProblems[]: slug, title, reason
  - nextSession: concrete 30-60 min plan
```

Ambii agenți folosesc `stopWhen: stepCountIs(6)` — iterează până la 6 tool calls, apoi forțează răspunsul final ca JSON validat cu Zod.

---

## Arhitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser (client)                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Landing /    │  │ Auth pages   │  │ /problems/[slug]     │  │
│  │ Wand intro + │  │ Signup +     │  │ Textarea + voice     │  │
│  │ illustrations│  │ Login        │  │ via Web Speech API   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                              │                   │
└──────────────────────────────────────────────┼──────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js 16 server (Node runtime)                    │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Auth.js v5  │  │ /api/submit  │  │ /api/coach           │  │
│  │ JWT + creds │  │ → Evaluator  │  │ → Coach agent        │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
│         │                  │                    │                │
│         ▼                  ▼                    ▼                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Prisma 7  →  better-sqlite3  →  dev.db                 │   │
│  │  6 models: User, Topic, Problem, ProblemTopic,          │   │
│  │            Submission, Recommendation                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Vercel AI SDK 6  →  @ai-sdk/google  →  Gemini API      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stack tehnologic

| Layer | Tehnologie | Rol |
|---|---|---|
| **Frontend framework** | Next.js 16 (App Router, Turbopack) | Routing + SSR + edge functions |
| **Limbaj** | TypeScript 5 | Type safety end-to-end |
| **UI library** | Tailwind CSS v4 + shadcn/ui (Radix) | Stilizare + componente accessible |
| **Iconuri** | Lucide React | SVG icons, tree-shakeable |
| **Auth** | Auth.js v5 (NextAuth) | JWT sessions, Credentials provider |
| **Hashing parole** | bcryptjs | bcrypt cu salt-uri |
| **Validation** | Zod 4 | Schema-uri runtime + tipuri TS derivate |
| **ORM** | Prisma 7 | Migrations, type-safe queries |
| **Database** | SQLite (better-sqlite3 adapter) | File-based, zero config local |
| **AI runtime** | Vercel AI SDK 6 | Provider-agnostic, tool calling, streaming |
| **LLM provider** | Google Gemini 2.5 Flash | Free tier 15 req/min, 1500/zi |
| **Voice input** | Web Speech API | Browser-native, zero cost, no API key |
| **Notifications** | Sonner (toast) | UI feedback non-blocking |

**Costul total pentru dezvoltare și demo:** **0 €**. Toate componentele rulează pe tier gratuit sau local.

---

## Structura proiectului

```
crucio/
├── app/                            # Next.js App Router
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/      # NextAuth handlers
│   │   │   └── signup/             # Custom signup endpoint cu Zod + bcrypt
│   │   ├── submit/                 # POST: invocă Evaluator agent
│   │   └── coach/                  # POST: invocă Coach agent
│   ├── business-foundation/        # Pagina cu documentul business (livrabil 1)
│   ├── pitch/                      # Pitch deck în 15 slide-uri scroll-snap (livrabil 4)
│   ├── leaderboard/                # Top 50 ELO
│   ├── login/, signup/             # Pagini auth
│   ├── problems/, problems/[slug]/ # Listă + detaliu problemă
│   ├── profile/                    # Stats + istoric submisii
│   ├── layout.tsx                  # Root layout cu SiteHeader + SiteFooter
│   └── page.tsx                    # Landing page (livrabil 3)
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── coach-panel.tsx             # Client component pentru Coach agent
│   ├── problem-solver.tsx          # Voice + textarea + submit + verdict UI
│   ├── illustration-coder-boy.tsx  # SVG hand-coded (cămașă albă, laptop)
│   ├── illustration-coder-girl.tsx # SVG hand-coded (rochie violet, monitor)
│   ├── wand-intro.tsx              # Wand spell animation (first visit only)
│   ├── site-header.tsx             # Top nav cu auth state
│   └── site-footer.tsx             # Footer cu link-uri către livrabile
│
├── lib/
│   ├── agents/
│   │   ├── evaluator.ts            # Evaluator agent + Zod schema răspuns
│   │   ├── coach.ts                # Coach agent + Zod schema răspuns
│   │   └── tools.ts                # Tool definitions pentru ambii agenți
│   ├── auth.ts                     # NextAuth config (Credentials provider)
│   ├── db.ts                       # Prisma client cu adapter SQLite
│   ├── elo.ts                      # Standard ELO formula (K=32)
│   └── utils.ts                    # cn() helper pentru Tailwind merge
│
├── prisma/
│   ├── schema.prisma               # 6 modele
│   ├── migrations/                 # SQL migrations
│   └── seed.ts                     # 8 topice + 15 probleme cu rubrici
│
├── docs/
│   ├── Crucio_Business_Foundation.docx
│   └── Crucio_Pitch.pptx
│
├── types/
│   └── next-auth.d.ts              # Extensie tipuri Session + JWT
│
└── public/                         # Static assets
```

---

## Run local

### Cerințe

- Node.js 20.9+
- Cheie API Google Gemini gratuită (https://aistudio.google.com/apikey)

### Pași

```bash
# 1. Clone
git clone https://github.com/CiprianAmza/crucio-mpa-2026.git
cd crucio-mpa-2026

# 2. Install deps
npm install

# 3. Configure env vars
cp .env.example .env
# Editează .env și adaugă:
#   GOOGLE_GENERATIVE_AI_API_KEY="github_pat_..."  (cheia ta Gemini)
#   AUTH_SECRET="..."  (generează cu: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")

# 4. Setup DB + seed
npx prisma migrate dev
npx tsx prisma/seed.ts

# 5. Run dev server
npm run dev
```

Apoi deschide http://localhost:3000

### Comenzi utile

```bash
npm run dev          # Pornește serverul dev (Turbopack)
npm run build        # Build pentru producție
npm run start        # Pornește build-ul de producție
npm run lint         # ESLint
npx tsc --noEmit     # Type check fără emit
npx prisma studio    # GUI pentru DB
```

---

## Date demo

După rularea seed-ului, baza conține 8 topice și 15 probleme. Pentru testare rapidă fără să creezi cont:

| Email | Parolă | Note |
|---|---|---|
| `test@crucio.local` | `testpass123` | Cont creat automat la testarea end-to-end |

Sau creează cont propriu la `/signup`.

---

## Rute disponibile

| Rută | Auth | Rol |
|---|:-:|---|
| `/` | — | Landing page cu wand intro + ilustrații + 3 features |
| `/login` | — | Sign in (Credentials provider) |
| `/signup` | — | Creare cont nou |
| `/problems` | da | Lista problemelor cu best-score per item |
| `/problems/[slug]` | da | Detaliu problemă + textarea + voice + submit |
| `/leaderboard` | — | Top 50 după ELO rating |
| `/profile` | da | Stats personale + istoricul submisiilor |
| `/business-foundation` | — | **Livrabil MPA 1** — document business complet |
| `/pitch` | — | **Livrabil MPA 4** — pitch deck 15 slide-uri scroll-snap |
| `/api/auth/[...nextauth]` | — | NextAuth endpoints (csrf, callback, session) |
| `/api/auth/signup` | — | POST: creare cont (Zod validation + bcrypt) |
| `/api/submit` | da | POST: invocă Evaluator + actualizează ELO |
| `/api/coach` | da | POST: invocă Coach + persistă recomandarea |

---

## Banca de probleme

15 probleme curate, distribuite pe 8 topice:

| Slug | Titlu | Difficulty | Base ELO | Topice |
|---|---|:-:|:-:|---|
| `solid-principles` | Explain the SOLID principles | 2 | 1200 | SOLID, OOP |
| `java-equals-hashcode` | Contract between equals() and hashCode() | 2 | 1150 | OOP, Collections |
| `concurrency-volatile-synchronized` | volatile vs synchronized vs Atomic | 4 | 1500 | Concurrency |
| `spring-bean-scopes` | Spring Bean scopes & lifecycle | 3 | 1300 | Spring |
| `jvm-gc-overview` | JVM Garbage Collection — generations | 4 | 1450 | JVM |
| `design-pattern-strategy` | Strategy pattern — design and Java idioms | 2 | 1200 | Patterns, OOP |
| `streams-collectors-deep` | Stream API — performance and pitfalls | 3 | 1350 | Streams |
| `executor-thread-pool` | Thread pools — sizing and pitfalls | 4 | 1500 | Concurrency |
| `transactions-isolation` | Transaction isolation & @Transactional | 4 | 1500 | Spring |
| `java-collections-overview` | Choosing the right Java Collection | 2 | 1200 | Collections |
| `rest-api-design` | Designing a clean REST API | 3 | 1300 | Spring |
| `spring-aop-explain` | How Spring AOP works under the hood | 4 | 1450 | Spring |
| `exception-handling-philosophy` | Checked vs unchecked exceptions | 3 | 1300 | OOP, Spring |
| `garbage-collection-tuning` | GC tuning for 99p latency-sensitive service | 5 | 1700 | JVM |
| `kafka-vs-rabbitmq` | Kafka vs RabbitMQ — when to choose what | 3 | 1400 | Spring |

Fiecare problemă are o rubrică structurată cu 4 criterii ponderate, lista de concepte cheie pe care răspunsul ar trebui să le acopere, și red flags care declanșează scor scăzut.

---

## Sistemul ELO

Crucio folosește formula clasică ELO (cu K = 32) pentru a calcula schimbarea de rating după fiecare submisie:

```
expected = 1 / (1 + 10^((problemBaseElo - playerRating) / 400))
actual   = agentScore / 10000        # normalizare 0..1
delta    = round(K * (actual - expected))
newElo   = playerRating + delta
```

Implementarea e în [`lib/elo.ts`](lib/elo.ts). Toți utilizatorii pornesc de la 1200, problemele au `baseElo` proporțional cu dificultatea (1150–1700).

---

## Disclosure AI

Conform cerinței MPA, declarăm transparent unde și cum am folosit AI:

- **Claude (Anthropic)** — generarea codului, deciziile de arhitectură, redactarea documentelor business. Toate prompt-urile sunt iterative, cu review uman pe fiecare modificare.
- **Google Gemini 2.5 Flash** — LLM-ul runtime care alimentează cei doi agenți (Evaluator + Coach) prin Vercel AI SDK.
- **Rubricile celor 15 probleme Java** — draft AI, urmat de review tehnic uman pentru calibrarea criteriilor și ponderilor.
- **Ilustrații SVG (Coder Boy/Girl)** — scrise manual ca cod SVG, **nu** generate AI.
- **Wand intro animation** — cod hand-written cu CSS keyframes.
- **Documentele de business** (Business Foundation .docx, Pitch deck .pptx) — generate programatic prin scripturi Node.js (docx-js, pptxgenjs), conținutul rafinat cu Claude.

---

## Roadmap

### Acum (Aprilie–Mai 2026)

- MVP live cu 15 probleme Java + rubrici curate
- Doi agenți (Evaluator + Coach) pe Gemini 2.5 Flash
- Voice input prin Web Speech API
- ELO + leaderboard + profile
- Auth complet (signup, login, session, logout)
- 100% gratuit pentru tier-ul de testare

### Următoarele 6 luni

- 200 probleme: Java, Python, Kotlin
- Track-uri suplimentare: System design, Behavioral
- Voice cu Whisper API (multi-language, multi-accent)
- B2B alpha cu 3 design partners
- Pilot 2 universități românești
- Stripe integration + lansare Pro tier (€9.99/lună)
- Dashboard recruiter pentru tier-ul B2B Screening (€499/lună/seat)

### Vision long-term

- Companion app mobile (React Native)
- Real-time mock interview cu AI live voice (Gemini Live)
- Marketplace de rubrici contributed by senior engineers
- Integrări ATS pentru companii (Greenhouse, Lever)

---

## Licență și context academic

Acest proiect este dezvoltat **exclusiv în scop academic** pentru cursul MPA 2026 din cadrul Universității din București. Codul sursă, documentele și pitch deck-ul sunt accesibile public sub licență de uz academic — colegii din alți ani sunt liberi să se inspire pentru proiectele lor, **fără a copia direct**.

> Idei împrumutate ne fac mai buni; cod copiat ne face mai săraci. — *folclor academic*

Pentru orice utilizare comercială sau în afara contextului universitar, contactați echipa.

---

<div align="center">

**Built with vibes by Grupa 506 · Universitatea din București · 2026**

[**Live demo**](http://localhost:3000) · [Pitch deck](docs/Crucio_Pitch.pptx) · [Business foundation](docs/Crucio_Business_Foundation.docx)

</div>
