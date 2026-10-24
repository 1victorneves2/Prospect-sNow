import { describe, expect, it } from 'vitest'
import { initialLeads, scoreLevel, stageColor } from './leads'

describe('dados demonstrativos de leads', () => {
  it('mantém IDs únicos e scores entre 0 e 100', () => {
    expect(new Set(initialLeads.map((lead) => lead.id)).size).toBe(initialLeads.length)
    expect(initialLeads.every((lead) => lead.score >= 0 && lead.score <= 100)).toBe(true)
    expect(initialLeads.every((lead) => stageColor[lead.stage])).toBe(true)
  })

  it('inclui valores demonstrativos para todas as etapas do pipeline', () => {
    const stages = new Set(initialLeads.map((lead) => lead.stage))

    expect(initialLeads).toHaveLength(13)
    expect(stages).toEqual(
      new Set([
        'Descoberto',
        'Analisado',
        'Contatado',
        'Respondeu',
        'Reunião',
        'Proposta',
        'Fechado',
      ]),
    )
    expect(initialLeads.some((lead) => !lead.phone)).toBe(true)
    expect(initialLeads.some((lead) => lead.site === 'Ausente')).toBe(true)
  })

  it('classifica as faixas de score corretamente', () => {
    expect(scoreLevel(49)).toBe('low')
    expect(scoreLevel(50)).toBe('medium')
    expect(scoreLevel(79)).toBe('medium')
    expect(scoreLevel(80)).toBe('high')
  })
})
