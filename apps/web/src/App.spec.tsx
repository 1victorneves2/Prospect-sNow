import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('prévia do frontend', () => {
  it('identifica dados fictícios e mantém as áreas navegáveis', () => {
    const html = renderToStaticMarkup(createElement(App))

    expect(html).toContain('Interface em construção.')
    expect(html).toContain('exemplos fictícios')
    expect(html).toContain('Navegação principal')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('Leads de exemplo')
    expect(html).not.toContain('R$ 42,8k')
  })
})
