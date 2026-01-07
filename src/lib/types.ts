export type Role = 'user' | 'assistant'

export type Source = {
  title: string
  detail?: string
  url?: string
  quote?: string
}

export type ChatMessage = {
  id: string
  role: Role
  content: string
  createdAt: number
  sources?: Source[]
}

export type KnowledgeModule = {
  id: string
  name: string
  description?: string
}

