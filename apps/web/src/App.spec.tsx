import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('prévia do frontend', () => {
  it('identifica dados fictícios e mantém as áreas navegáveis', () => {
    const html = renderToStaticMarkup(createElement(App))

    expect(html).toContain('Encontre sua próxima oportunidade')
    expect(html).toContain('As demais telas são demonstrativas')
    expect(html).toContain('Navegação principal')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('Buscar empresas')
    expect(html).not.toContain('R$ 42,8k')
  })
})
