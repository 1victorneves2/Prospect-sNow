# Sistema visual — proposta inicial

Status: proposta em validação. A direção final de marca e UX depende de aprovação humana na task do Notion. Esta base preserva a identidade já presente no protótipo e pode ser refinada sem alterar as regras do produto.

## Princípios

1. Clareza antes de volume: uma ação principal por contexto; estados de demonstração, carregamento e erro sempre explícitos.
2. Evidência antes de conclusão: fatos, hipóteses e score devem ser distinguíveis visualmente e por texto, nunca só por cor.
3. Controle humano: ações de contato e aprovação devem dizer claramente o que acontecerá; nenhuma tela sugere envio automático.
4. Responsividade real: todas as áreas são alcançáveis no celular, inclusive tabelas e pipeline com rolagem horizontal identificável.
5. Acessibilidade: navegação por teclado, foco visível, nome acessível para botões de ícone e contraste legível.

## Tokens iniciais

Os tokens implementados em `apps/web/src/styles.css` são a fonte atual da interface. Usar semanticamente; valores abaixo não são ainda um manual de marca aprovado.

| Token             | Valor     | Uso                   |
| ----------------- | --------- | --------------------- |
| `--color-ink`     | `#262338` | Texto principal       |
| `--color-plum`    | `#211e35` | Navegação lateral     |
| `--color-primary` | `#564078` | Ação principal        |
| `--color-accent`  | `#ae93d3` | Destaques secundários |
| `--color-surface` | `#ffffff` | Cartões e diálogos    |
| `--color-canvas`  | `#f7f6fa` | Fundo da aplicação    |
| `--color-line`    | `#e8e4ee` | Divisórias e bordas   |
| `--radius-card`   | `14px`    | Cartões               |

Tipografia: Manrope para interface, Playfair Display apenas para títulos editoriais e DM Mono para rótulos curtos. A fonte remota é provisória; avaliar hospedagem local e fallback no refinamento de performance/privacidade.

## Componentes-base

- `AppShell`: sidebar no desktop e navegação horizontal rolável no mobile; a seção ativa deve ser perceptível.
- `PageHeading`: título, descrição breve e, quando houver, ação contextual real.
- `Panel` e `Metric`: superfícies com hierarquia consistente, estado e dados derivados da mesma fonte.
- `SearchDialog` e `LeadDrawer`: diálogos nomeados, fecháveis por Escape, foco inicial e retorno ao disparador. Gerenciamento completo de foco deverá ser consolidado em componente compartilhado.
- Formulários: rótulos visíveis, campos com foco, obrigatoriedade e feedback contextual.

## Componentes de domínio

- `LeadRow` e `LeadCard`: nome, segmento, região, score e etapa; abertura via botão navegável por teclado.
- `Score`: sempre acompanhado de descrição e origem do cálculo; valores do protótipo são ilustrativos.
- `Evidence`: separar “fato observado” e “hipótese comercial”; em dados reais mostrar fonte e data verificadas.
- `Pipeline`: etapa e contagem calculadas dos leads; movimentos reais exigirão validação no backend.
- `MessageDraft`: mostrar estado de rascunho e aprovação humana; sem controle de envio enquanto a API não existir.

## Próximos passos de UX

1. Aprovar ou ajustar a direção visual com base nas referências enviadas.
2. Transformar componentes-base em arquivos reutilizáveis e adicionar testes de interação e estados vazio/erro/volume.
3. Conectar dados reais somente após autenticação, contrato de API e persistência.

Nesta etapa, a aplicação é uma prévia com dados fictícios e sem persistência. Nenhum indicador ou fonte simulada deve ser apresentado como resultado real.
