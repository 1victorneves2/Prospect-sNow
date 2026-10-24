import { describe, expect, it } from 'vitest'
import { allowedTransitions, canTransition, isValidTransitionReason } from './pipeline'

describe('transições do pipeline demonstrativo', () => {
  it('permite avançar ou corrigir apenas uma etapa por vez', () => {
    expect(allowedTransitions('Descoberto')).toEqual(['Analisado'])
    expect(canTransition('Analisado', 'Contatado')).toBe(true)
    expect(canTransition('Analisado', 'Descoberto')).toBe(true)
    expect(canTransition('Descoberto', 'Contatado')).toBe(false)
    expect(canTransition('Fechado', 'Descoberto')).toBe(false)
    expect(canTransition('Fechado', 'Proposta')).toBe(true)
  })

  it('exige uma justificativa curta antes de registrar a transição', () => {
    expect(isValidTransitionReason('  ')).toBe(false)
    expect(isValidTransitionReason('ok')).toBe(false)
    expect(isValidTransitionReason('Cliente respondeu')).toBe(true)
  })
})
