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

export const initialLeads: Lead[] = [
  {
    id: 1,
    name: 'Bella Moda Feminina',
    segment: 'Moda e vestuário',
    region: 'Adrianópolis',
    score: 92,
    stage: 'Analisado',
    phone: true,
    site: 'Linktree',
    updated: 'Hoje, 10:34',
  },
  {
    id: 2,
    name: 'Maison Lune Semijoias',
    segment: 'Semijoias',
    region: 'Vieiralves',
    score: 86,
    stage: 'Contatado',
    phone: true,
    site: 'Ausente',
    updated: 'Hoje, 09:22',
  },
  {
    id: 3,
    name: 'Ateliê Aurora',
    segment: 'Moda e vestuário',
    region: 'Ponta Negra',
    score: 78,
    stage: 'Descoberto',
    phone: false,
    site: 'Ausente',
    updated: 'Ontem',
  },
  {
    id: 4,
    name: 'Studio Vivá',
    segment: 'Clínica de estética',
    region: 'Parque Dez',
    score: 71,
    stage: 'Respondeu',
    phone: true,
    site: 'Ativo',
    updated: 'Ontem',
  },
  {
    id: 5,
    name: 'Casa Forma Planejados',
    segment: 'Móveis planejados',
    region: 'Flores',
    score: 64,
    stage: 'Reunião',
    phone: true,
    site: 'Ativo',
    updated: 'Segunda-feira',
  },
]

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
