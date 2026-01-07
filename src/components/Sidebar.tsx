import { useMemo, useState } from 'react'
import type { KnowledgeModule } from '../lib/types'

type Props = {
  modules: KnowledgeModule[]
  selectedModuleIds: string[]
  activeModuleId?: string
  onToggleModule: (id: string) => void
  onSetActive: (id: string) => void
}

export function Sidebar({
  modules,
  selectedModuleIds,
  activeModuleId,
  onToggleModule,
  onSetActive,
}: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return modules
    return modules.filter((m) => m.name.toLowerCase().includes(q))
  }, [modules, query])

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-800/70 bg-slate-950/40 backdrop-blur">
      <div className="border-b border-slate-800/60 px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold tracking-[0.22em] text-slate-400">
              EXECUTIVE
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-100">
              Knowledge Modules
            </div>
          </div>
          <div className="h-9 w-9 rounded-xl border border-slate-800/70 bg-gradient-to-br from-blue-500/20 to-slate-900/30 shadow-[0_0_0_1px_rgba(59,130,246,0.08)_inset]">
            <div className="grid h-full w-full place-items-center">
              <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.65)]" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="sr-only" htmlFor="module-search">
            Search knowledge modules
          </label>
          <input
            id="module-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules…"
            className="w-full rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-blue-500/0 transition focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-3">
        <div className="space-y-1.5">
          {filtered.map((m) => {
            const checked = selectedModuleIds.includes(m.id)
            const active = activeModuleId === m.id
            return (
              <div
                key={m.id}
                className={[
                  'group flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition',
                  active
                    ? 'border-blue-500/35 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.12)_inset]'
                    : 'border-slate-900/0 bg-slate-950/20 hover:border-slate-800/70 hover:bg-slate-950/35',
                ].join(' ')}
                onClick={() => onSetActive(m.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSetActive(m.id)
                }}
              >
                <button
                  type="button"
                  aria-pressed={checked}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleModule(m.id)
                  }}
                  className={[
                    'mt-0.5 grid h-5 w-5 place-items-center rounded-md border transition',
                    checked
                      ? 'border-blue-500/50 bg-blue-500/20'
                      : 'border-slate-700/60 bg-slate-950/30 group-hover:border-slate-600/70',
                  ].join(' ')}
                >
                  {checked ? (
                    <span className="block h-2.5 w-2.5 rounded-sm bg-blue-400" />
                  ) : null}
                </button>

                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-100">
                    {m.name}
                  </div>
                  {m.description ? (
                    <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                      {m.description}
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-slate-800/60 px-5 py-4">
        <div className="text-xs text-slate-500">
          Selected:{' '}
          <span className="font-semibold text-slate-300">
            {selectedModuleIds.length}
          </span>
        </div>
      </div>
    </aside>
  )
}

