import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { initialLeads } from '../demo/leads'
import { LeadResults } from './LeadResults'

const noOp = () => {}

describe('LeadResults', () => {
  it('shows an accessible loading state', () => {
    const html = renderToStaticMarkup(
      createElement(LeadResults, {
        leads: [],
        query: '',
        status: 'loading',
        onRetry: noOp,
        onSelect: noOp,
      }),
    )

    expect(html).toContain('aria-busy="true"')
    expect(html).toContain('Carregando leads')
  })

  it('shows a retry action when loading fails', () => {
    const html = renderToStaticMarkup(
      createElement(LeadResults, {
        leads: [],
        query: '',
        status: 'error',
        onRetry: vi.fn(),
        onSelect: noOp,
      }),
    )

    expect(html).toContain('role="alert"')
    expect(html).toContain('Tentar novamente')
  })

  it('distinguishes an empty base from a search without matches', () => {
    const empty = renderToStaticMarkup(
      createElement(LeadResults, {
        leads: [],
        query: '',
        status: 'ready',
        onRetry: noOp,
        onSelect: noOp,
      }),
    )
    const filtered = renderToStaticMarkup(
      createElement(LeadResults, {
        leads: [],
        query: 'segmento inexistente',
        status: 'ready',
        onRetry: noOp,
        onSelect: noOp,
      }),
    )

    expect(empty).toContain('Sua base ainda está vazia.')
    expect(filtered).toContain('Nenhum resultado para esta busca.')
  })

  it('renders a successful result list', () => {
    const html = renderToStaticMarkup(
      createElement(LeadResults, {
        leads: initialLeads,
        query: '',
        status: 'ready',
        onRetry: noOp,
        onSelect: noOp,
      }),
    )

    expect(html).toContain('<table>')
    expect(html).toContain('Bella Moda Feminina')
    expect(html).toContain(
      'Ateliê Amazonense de Moda Sustentável e Acessórios Artesanais da Floresta',
    )
  })
})
