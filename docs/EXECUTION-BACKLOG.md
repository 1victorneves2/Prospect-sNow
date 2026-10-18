# Backlog executável — próxima sequência

Este arquivo espelha as tarefas adicionadas ao banco [Snowdrop Prospect — Execução](https://app.notion.com/p/bc7ff81ee55e41b7aee680f3d326cfe0). O Notion mantém o acompanhamento operacional; este arquivo mantém a sequência versionada junto do código.

## Ordem recomendada

1. [Criar cliente Prisma e módulo de persistência](https://app.notion.com/p/3fda9e77d28e81aaa9f7cc6954031848) — P0, Fundação. Depende do PostgreSQL de desenvolvimento.
2. [Expor contrato inicial de leads na API](https://app.notion.com/p/3fda9e77d28e8190ab45cd31f7a67aa2) — P0, Fundação. Depende do Prisma e da primeira migration.
3. [Implementar autorização por organização e papel](https://app.notion.com/p/3fda9e77d28e812ca700cac85a712214) — P0, Fundação. Depende da autenticação/RBAC planejada.
4. [Implementar deduplicação determinística de leads](https://app.notion.com/p/3fda9e77d28e8142b2e9e40fc8aca16b) — P1, Fundação. Depende do contrato de leads.
5. [Implementar máquina de estados do pipeline](https://app.notion.com/p/3fda9e77d28e81b29a3cd9ed97385e0b) — P0, Conversão. Depende do contrato de leads.
6. [Criar serviço de cálculo de score versionado](https://app.notion.com/p/3fda9e77d28e819db069c7a12e7998e8) — P0, Inteligência. Depende da interface de evidências.
7. [Criar pipeline de CI para validação do backend](https://app.notion.com/p/3fda9e77d28e81f099cacf9cd520c0e7) — P1, Publicação. Depende do contrato inicial de leads.

## Regras de execução

- Uma tarefa só muda para **Em andamento** quando o trabalho começar de fato.
- Uma tarefa só muda para **Concluído** após validação, commit e push registrados no Notion.
- Cada entrega deve preservar aprovação humana, não expor segredos e atualizar testes proporcionais ao risco.
- A branch de trabalho é `work`; `main` permanece como referência estável até uma decisão explícita de promoção.
