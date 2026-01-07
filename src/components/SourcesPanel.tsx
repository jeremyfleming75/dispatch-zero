import type { Source } from '../lib/types'

type Props = {
  sources: Source[]
}

export function SourcesPanel({ sources }: Props) {
  return (
    <aside className="flex h-full w-96 shrink-0 flex-col border-l border-slate-800/70 bg-slate-950/35 backdrop-blur">
      <div className="border-b border-slate-800/60 px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold tracking-[0.22em] text-slate-400">
              TRUST LAYER
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              Sources
            </div>
          </div>
          <div className="rounded-full border border-slate-800/70 bg-slate-950/40 px-3 py-1 text-xs text-slate-400">
            {sources.length}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4">
        {sources.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/20 p-4 text-sm text-slate-400">
            No citations yet. Ask a question and the Oracle will list supporting
            evidence here.
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((s, idx) => (
              <div
                key={`${s.title}-${idx}`}
                className="rounded-2xl border border-slate-800/60 bg-slate-950/20 p-4"
              >
                <div className="text-sm font-semibold text-slate-100">
                  {s.url ? (
                    <a
                      className="underline decoration-slate-700 underline-offset-4 hover:decoration-blue-500/60"
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.title}
                    </a>
                  ) : (
                    s.title
                  )}
                </div>
                {s.detail ? (
                  <div className="mt-1 text-xs leading-5 text-slate-400">
                    {s.detail}
                  </div>
                ) : null}
                {s.quote ? (
                  <div className="mt-3 rounded-xl border border-slate-800/60 bg-slate-950/30 p-3 text-xs leading-5 text-slate-300">
                    <div className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-slate-500">
                      EXCERPT
                    </div>
                    <div className="whitespace-pre-wrap">{s.quote}</div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-800/60 px-5 py-4 text-xs text-slate-500">
        Citations are generated per response.
      </div>
    </aside>
  )
}

