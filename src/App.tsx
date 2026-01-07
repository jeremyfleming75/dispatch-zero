import { useMemo, useState } from 'react'
import { Chat } from './components/Chat'
import { Sidebar } from './components/Sidebar'
import { SourcesPanel } from './components/SourcesPanel'
import type { KnowledgeModule, Source } from './lib/types'

// ================================
// System Prompt (edit this)
// ================================
const SYSTEM_PROMPT = `
[PASTE YOUR NOTEBOOKLM SYNTHESIS HERE]

You are the Executive Intelligence Oracle: concise, precise, high-signal.
Prioritize decision-grade outputs: options, tradeoffs, risks, and next actions.
Never mention external tools or providers. Provide citations when making claims.
`.trim()

const DEFAULT_MODULES: KnowledgeModule[] = [
  {
    id: 'mod-market',
    name: 'Market Dynamics',
    description: 'Demand signals, cycles, pricing power, TAM/SAM/SOM.',
  },
  {
    id: 'mod-competition',
    name: 'Competitive Landscape',
    description: 'Moats, substitutes, distribution, positioning, threats.',
  },
  {
    id: 'mod-operations',
    name: 'Operating System',
    description: 'Levers, KPIs, bottlenecks, process and execution quality.',
  },
  {
    id: 'mod-finance',
    name: 'Capital Strategy',
    description: 'Unit economics, cash profile, allocation, scenarios.',
  },
  {
    id: 'mod-risk',
    name: 'Risk Signals',
    description: 'Fragilities, tail risks, compliance, second-order effects.',
  },
  {
    id: 'mod-narrative',
    name: 'Leadership Narrative',
    description: 'Clarity, messaging, stakeholder alignment, operating cadence.',
  },
]

export default function App() {
  const [modules] = useState<KnowledgeModule[]>(DEFAULT_MODULES)
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    'mod-market',
    'mod-competition',
    'mod-finance',
  ])
  const [activeModuleId, setActiveModuleId] = useState<string>('mod-market')
  const [sources, setSources] = useState<Source[]>([])

  const selectedModuleNames = useMemo(() => {
    const map = new Map(modules.map((m) => [m.id, m.name] as const))
    return selectedModuleIds.map((id) => map.get(id) ?? id)
  }, [modules, selectedModuleIds])

  function toggleModule(id: string) {
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full">
        <Sidebar
          modules={modules}
          selectedModuleIds={selectedModuleIds}
          activeModuleId={activeModuleId}
          onToggleModule={toggleModule}
          onSetActive={setActiveModuleId}
        />

        <main className="min-w-0 flex-1">
          <Chat
            systemPrompt={SYSTEM_PROMPT}
            selectedModuleNames={selectedModuleNames}
            onSources={setSources}
          />
        </main>

        <SourcesPanel sources={sources} />
      </div>
    </div>
  )
}
