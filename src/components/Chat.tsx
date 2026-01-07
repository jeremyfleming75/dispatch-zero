import { useEffect, useMemo, useRef, useState } from 'react'
import { sendChat } from '../lib/api'
import type { ChatMessage, Source } from '../lib/types'
import { ThinkingDots } from './ThinkingDots'

type Props = {
  systemPrompt: string
  selectedModuleNames: string[]
  onSources: (sources: Source[]) => void
}

function uid() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const THREAD_STORAGE_KEY = 'eio.threadId'

export function Chat({ systemPrompt, selectedModuleNames, onSources }: Props) {
  const [threadId, setThreadId] = useState<string | undefined>(() => {
    const v = localStorage.getItem(THREAD_STORAGE_KEY)
    return v || undefined
  })
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: 'assistant',
      createdAt: Date.now(),
      content:
        "Welcome. Ask a question, and I'll respond with supporting sources for high-confidence decisions.",
    },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const selectedModulesText = useMemo(
    () => selectedModuleNames.join(', '),
    [selectedModuleNames],
  )

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isThinking])

  async function handleSend() {
    const text = input.trim()
    if (!text || isThinking) return

    setError(null)
    setInput('')

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: text,
      createdAt: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsThinking(true)

    try {
      const res = await sendChat({
        message: text,
        threadId,
        systemPrompt,
        selectedModules: selectedModuleNames,
      })

      setThreadId(res.threadId)
      localStorage.setItem(THREAD_STORAGE_KEY, res.threadId)

      const assistantMsg: ChatMessage = {
        id: uid(),
        role: 'assistant',
        content: res.answer,
        createdAt: Date.now(),
        sources: res.sources,
      }

      setMessages((prev) => [...prev, assistantMsg])
      onSources(res.sources)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Request failed.'
      setError(msg)
    } finally {
      setIsThinking(false)
    }
  }

  function handleNewThread() {
    setThreadId(undefined)
    localStorage.removeItem(THREAD_STORAGE_KEY)
    onSources([])
    setMessages([
      {
        id: uid(),
        role: 'assistant',
        createdAt: Date.now(),
        content:
          "Fresh thread initialized. Ask a question and I'll anchor the answer in sources.",
      },
    ])
  }

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-slate-800/60 bg-slate-950/25 px-6 py-4 backdrop-blur">
        <div className="min-w-0">
          <div className="text-xs font-semibold tracking-[0.22em] text-slate-400">
            EXECUTIVE INTELLIGENCE
          </div>
          <div className="mt-1 truncate text-lg font-semibold text-slate-100">
            Oracle Console
          </div>
          <div className="mt-1 truncate text-xs text-slate-500">
            Active modules:{' '}
            <span className="text-slate-300">
              {selectedModulesText || 'None selected'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-slate-800/70 bg-slate-950/40 px-3 py-1 text-xs text-slate-400 sm:block">
            {threadId ? 'Thread active' : 'New thread'}
          </div>
          <button
            type="button"
            onClick={handleNewThread}
            className="rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2 text-sm font-semibold text-slate-100 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition hover:border-slate-700/70 hover:bg-slate-950/55 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          >
            New thread
          </button>
        </div>
      </header>

      <div ref={scrollerRef} className="flex-1 overflow-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user'
            return (
              <div
                key={m.id}
                className={[
                  'flex',
                  isUser ? 'justify-end' : 'justify-start',
                ].join(' ')}
              >
                <div
                  className={[
                    'max-w-[92%] rounded-2xl border px-4 py-3 text-sm leading-6 shadow-sm',
                    isUser
                      ? 'border-blue-500/35 bg-gradient-to-b from-blue-500/18 to-slate-950/25 text-slate-100 shadow-[0_0_0_1px_rgba(59,130,246,0.12)_inset]'
                      : 'border-slate-800/60 bg-slate-950/20 text-slate-100',
                  ].join(' ')}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            )
          })}

          {isThinking ? (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/20 px-4 py-3 text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.7)]" />
                  <ThinkingDots />
                  <span className="text-xs text-slate-400">
                    Processing with precision…
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <div className="font-semibold">Request failed</div>
              <div className="mt-1 text-rose-100/90">{error}</div>
            </div>
          ) : null}
        </div>
      </div>

      <footer className="border-t border-slate-800/60 bg-slate-950/25 px-6 py-5 backdrop-blur">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/30 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Oracle…"
              rows={2}
              className="w-full resize-none bg-transparent text-sm leading-6 text-slate-100 placeholder:text-slate-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void handleSend()
                }
              }}
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Enter to send • Shift+Enter for newline
              </div>
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={!input.trim() || isThinking}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(59,130,246,0.25)] transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
                <span className="text-white/80">↵</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}

