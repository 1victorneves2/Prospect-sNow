import demoLeads from './leads.json'

export type Stage =
  'Descoberto' | 'Analisado' | 'Contatado' | 'Respondeu' | 'Reunião' | 'Proposta' | 'Fechado'
export type Lead = {
  id: number
  name: string
  segment: string
  region: string
  score: number
  stage: Stage
  phone: boolean
  site: 'Ausente' | 'Linktree' | 'Ativo'
  updated: string
}

export const initialLeads = demoLeads as Lead[]

export const stageColor: Record<Stage, string> = {
  Descoberto: 'slate',
  Analisado: 'violet',
  Contatado: 'blue',
  Respondeu: 'amber',
  Reunião: 'rose',
  Proposta: 'cyan',
  Fechado: 'green',
}

export function scoreLevel(score: number) {
  return score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low'
}
