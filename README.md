# Executive Intelligence Oracle (Dashboard)

High-end, dark premium React dashboard with:

- **Left sidebar**: Knowledge Modules
- **Center**: Fast chat console
- **Right panel**: Sources / citations (trust layer)

The UI is built with **React + Vite + Tailwind CSS**, and the chat connects to the **OpenAI Assistants API** via a small Express server (`server/index.js`) so your API key stays server-side.

## Setup

1) Install dependencies

```bash
npm install
```

2) Configure environment variables

Create a `.env` at the repo root:

```bash
cp .env.example .env
```

Fill in:

- `OPENAI_API_KEY`
- `OPENAI_ASSISTANT_ID`

3) Run (UI + API together)

```bash
npm run dev:all
```

The UI runs on Vite, and requests to `/api/*` are proxied to the Express server on port `8787`.

## System prompt

Paste your synthesized knowledge into the `SYSTEM_PROMPT` constant at the top of:

- `src/App.tsx`

