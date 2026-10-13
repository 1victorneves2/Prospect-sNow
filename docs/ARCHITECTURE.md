# Arquitetura do Snowdrop Prospect

## Decisão para o MVP

O produto será um monorepo TypeScript com componentes separados por responsabilidade:

```text
apps/web      React + Vite: interface interna
apps/api      NestJS: regras, autenticação e integrações
packages/*    contratos e utilitários compartilhados (quando necessários)
prisma/       schema e migrações PostgreSQL
docs/         decisões, contratos e guias de operação
```

O frontend jamais chama Google Places, OpenAI, banco de dados ou WhatsApp diretamente.
A API recebe requisições autenticadas, aplica autorização, valida com Zod e registra
atividades/auditoria antes de acionar integrações.

## Fluxo de dados

```text
Web → API autenticada → PostgreSQL
                  ├── Google Places API (descoberta, sob demanda)
                  └── OpenAI API (análise e rascunho, sob demanda)
```

Pesquisas longas ficam registradas em `SearchJob`. No início podem ser síncronas em
pequena escala; ao crescer, a execução sai do request HTTP e passa para fila/workflow.

## Módulos da API

| Módulo      | Responsabilidade                              | Estado inicial                   |
| ----------- | --------------------------------------------- | -------------------------------- |
| `health`    | Liveness/readiness para deploy                | primeiro a criar                 |
| `auth`      | Login, sessão/JWT e papéis                    | obrigatório antes de dados reais |
| `leads`     | CRUD, deduplicação e não-contato              | fundação comercial               |
| `pipeline`  | status, oportunidade, atividades, follow-up   | após leads                       |
| `discovery` | Google Places, field masks e `SearchJob`      | credencial necessária            |
| `analysis`  | evidências, score explicável e IA             | nunca inventar fatos             |
| `outreach`  | rascunho, edição, aprovação e registro manual | sem envio automático             |

## Regras inegociáveis

1. `LeadEvidence` só contém fatos observáveis, URL e data de verificação.
2. Hipótese comercial é sempre separada do fato, com confiança explícita.
3. Score é calculado por regras auditáveis; IA pode recomendar, não substituir a regra.
4. O status `doNotContact` bloqueia novos rascunhos e contatos.
5. A criação de lead deduplica por organização, nome normalizado e cidade; referências
   de provedor também são únicas.
6. Dados provenientes do Google têm proveniência e prazo de retenção controláveis.
7. IA recebe apenas contexto necessário e conteúdo externo é tratado como não confiável.

## Deploy planejado

- Web: Vercel.
- API: inicialmente Render/Railway ou Functions compatíveis, conforme o limite de
  duração e a necessidade de jobs da integração.
- Banco: PostgreSQL gerenciado, em região próxima da API.
- Segredos: configurados em cada ambiente de deploy; nunca commitados, logados ou
  expostos em variáveis `VITE_*`.

## Ambientes

| Ambiente   | Finalidade              | Dados                              |
| ---------- | ----------------------- | ---------------------------------- |
| local      | desenvolvimento         | banco local e dados demonstrativos |
| preview    | revisão de pull request | dados sintéticos, chaves isoladas  |
| production | operação interna        | dados comerciais reais             |
