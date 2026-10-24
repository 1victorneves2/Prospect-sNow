import type { Stage } from './leads'

const transitions: Record<Stage, Stage[]> = {
  Descoberto: ['Analisado'],
  Analisado: ['Descoberto', 'Contatado'],
  Contatado: ['Analisado', 'Respondeu'],
  Respondeu: ['Contatado', 'Reunião'],
  Reunião: ['Respondeu', 'Proposta'],
  Proposta: ['Reunião', 'Fechado'],
  Fechado: ['Proposta'],
}

export function allowedTransitions(stage: Stage): Stage[] {
  return transitions[stage]
}

export function canTransition(from: Stage, to: Stage): boolean {
  return transitions[from].includes(to)
}

export function isValidTransitionReason(reason: string): boolean {
  return reason.trim().length >= 3
}
