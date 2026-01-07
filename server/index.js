import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import OpenAI from 'openai'

const PORT = Number(process.env.PORT || 8787)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID

function requireEnv(name, value) {
  if (!value) {
    const err = new Error(`Missing required environment variable: ${name}`)
    // @ts-ignore - express error handler will serialize message
    err.statusCode = 500
    throw err
  }
  return value
}

function buildInstructions(systemPrompt) {
  return `
You are the Executive Intelligence Oracle.

Hard rules:
- Never mention external tools, providers, or implementation details.
- If uncertain, say so and propose what to verify.
- Keep answers decision-grade: executive summary, options, tradeoffs, risks, and recommended next actions.

Output format:
- Return STRICT JSON only (no markdown, no commentary).
- Schema:
  {
    "answer": string,
    "sources": Array<{ "title": string, "detail"?: string, "url"?: string, "quote"?: string }>
  }

Context:
${systemPrompt || ''}
`.trim()
}

function extractJsonObject(text) {
  const trimmed = (text || '').trim()
  if (!trimmed) return null

  // Fast path: already JSON
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed

  // Fallback: pick the largest {...} region
  const first = trimmed.indexOf('{')
  const last = trimmed.lastIndexOf('}')
  if (first >= 0 && last > first) return trimmed.slice(first, last + 1)
  return null
}

function normalizeResponse({ rawText, annotationSources }) {
  const jsonCandidate = extractJsonObject(rawText)
  if (jsonCandidate) {
    try {
      const parsed = JSON.parse(jsonCandidate)
      const answer =
        typeof parsed.answer === 'string' ? parsed.answer : String(parsed.answer ?? rawText)
      const sources = Array.isArray(parsed.sources) ? parsed.sources : []

      return {
        answer,
        sources: [
          ...sources
            .filter(Boolean)
            .map((s) => ({
              title: typeof s.title === 'string' ? s.title : 'Source',
              detail: typeof s.detail === 'string' ? s.detail : undefined,
              url: typeof s.url === 'string' ? s.url : undefined,
              quote: typeof s.quote === 'string' ? s.quote : undefined,
            })),
          ...annotationSources,
        ].slice(0, 24),
      }
    } catch {
      // fall through
    }
  }

  return {
    answer: rawText || '',
    sources: annotationSources.slice(0, 24),
  }
}

function getAssistantTextAndSources(msg) {
  const sources = []
  const chunks = []

  for (const part of msg.content || []) {
    if (part.type !== 'text') continue
    const value = part.text?.value || ''
    chunks.push(value)

    const annotations = part.text?.annotations || []
    for (const a of annotations) {
      if (a.type === 'file_citation' && a.file_citation) {
        sources.push({
          title: 'File citation',
          detail: a.file_citation.file_id,
          quote: a.text || undefined,
        })
      } else if (a.type === 'file_path' && a.file_path) {
        sources.push({
          title: 'File reference',
          detail: a.file_path.file_id,
          quote: a.text || undefined,
        })
      }
    }
  }

  return { rawText: chunks.join('\n').trim(), annotationSources: sources }
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/chat', async (req, res, next) => {
  try {
    requireEnv('OPENAI_API_KEY', OPENAI_API_KEY)
    requireEnv('OPENAI_ASSISTANT_ID', OPENAI_ASSISTANT_ID)

    const { message, threadId, systemPrompt, selectedModules } = req.body || {}

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' })
    }

    const client = new OpenAI({ apiKey: OPENAI_API_KEY })

    const thread =
      typeof threadId === 'string' && threadId.trim()
        ? { id: threadId.trim() }
        : await client.beta.threads.create()

    const modulesLine = Array.isArray(selectedModules)
      ? selectedModules.filter((x) => typeof x === 'string' && x.trim()).join(', ')
      : ''

    const userContent = modulesLine
      ? `Selected Knowledge Modules: ${modulesLine}\n\nQuestion: ${message.trim()}`
      : `Question: ${message.trim()}`

    await client.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: userContent,
    })

    const runParams = {
      assistant_id: OPENAI_ASSISTANT_ID,
      instructions: buildInstructions(typeof systemPrompt === 'string' ? systemPrompt : ''),
    }

    // Prefer SDK polling helper when available.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const runs = client.beta.threads.runs
    let run
    if (typeof runs.createAndPoll === 'function') {
      run = await runs.createAndPoll(thread.id, runParams)
    } else {
      run = await runs.create(thread.id, runParams)
      for (let i = 0; i < 60; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const r = await runs.retrieve(thread.id, run.id)
        if (r.status === 'completed') {
          run = r
          break
        }
        if (['failed', 'cancelled', 'expired'].includes(r.status)) {
          throw new Error(`Run ended with status: ${r.status}`)
        }
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r2) => setTimeout(r2, 500))
      }
    }

    if (!run || run.status !== 'completed') {
      throw new Error('Run did not complete in time.')
    }

    const list = await client.beta.threads.messages.list(thread.id, { limit: 20 })
    const latestAssistant = (list.data || []).find((m) => m.role === 'assistant')
    if (!latestAssistant) {
      throw new Error('No assistant message returned.')
    }

    const { rawText, annotationSources } = getAssistantTextAndSources(latestAssistant)
    const normalized = normalizeResponse({ rawText, annotationSources })

    res.json({
      threadId: thread.id,
      answer: normalized.answer,
      sources: normalized.sources,
    })
  } catch (err) {
    next(err)
  }
})

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const statusCode = typeof err?.statusCode === 'number' ? err.statusCode : 500
  const message = err instanceof Error ? err.message : 'Server error'
  res.status(statusCode).json({ error: message })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`)
})

