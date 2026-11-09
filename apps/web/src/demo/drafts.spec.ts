import { describe, expect, it } from 'vitest'
import { approveDraft, editDraft } from './drafts'

describe('rascunhos demonstrativos', () => {
  it('exige texto para aprovar e invalida a aprovação quando o texto muda', () => {
    expect(approveDraft({ text: '  ', approved: false }).approved).toBe(false)
    const approved = approveDraft({ text: 'Olá, tudo bem?', approved: false })
    expect(approved.approved).toBe(true)
    expect(editDraft(approved, 'Olá, tudo bem?').approved).toBe(true)
    expect(editDraft(approved, 'Olá!').approved).toBe(false)
  })
})
