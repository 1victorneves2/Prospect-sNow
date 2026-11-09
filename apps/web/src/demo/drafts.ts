export type Draft = {
  text: string
  approved: boolean
}

export function editDraft(draft: Draft, text: string): Draft {
  return { text, approved: draft.text === text && draft.approved }
}

export function approveDraft(draft: Draft): Draft {
  return draft.text.trim() ? { ...draft, approved: true } : draft
}
