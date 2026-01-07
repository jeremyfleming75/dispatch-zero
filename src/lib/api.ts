import type { Source } from './types'

export type ChatRequest = {
  message: string
  threadId?: string
  systemPrompt: string
  selectedModules: string[]
}

export type ChatResponse = {
  threadId: string
  answer: string
  sources: Source[]
}

export async function sendChat(req: ChatRequest): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }

  return (await res.json()) as ChatResponse
}

