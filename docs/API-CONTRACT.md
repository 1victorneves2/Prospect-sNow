# Contrato de API inicial

Prefixo: `/v1`. Todas as rotas abaixo, exceto health e login, exigem autenticação.
Os formatos finais devem ser validados em runtime com Zod.

| Método  | Rota                         | Propósito                                              |
| ------- | ---------------------------- | ------------------------------------------------------ |
| `GET`   | `/health`                    | estado do serviço, sem dados sensíveis                 |
| `POST`  | `/auth/login`                | iniciar sessão (definir provedor antes de implementar) |
| `GET`   | `/leads`                     | listar, filtrar e paginar leads                        |
| `POST`  | `/leads`                     | criar lead manual com deduplicação                     |
| `GET`   | `/leads/:id`                 | detalhe, evidências, análises e histórico              |
| `PATCH` | `/leads/:id`                 | atualizar dados permitidos e status                    |
| `POST`  | `/leads/:id/evidence`        | registrar fato observado com fonte                     |
| `POST`  | `/leads/:id/analyses`        | calcular score e criar diagnóstico                     |
| `POST`  | `/leads/:id/outreach-drafts` | gerar rascunho revisável                               |
| `PATCH` | `/outreach-drafts/:id`       | editar/aprovar/arquivar rascunho                       |
| `POST`  | `/leads/:id/activities`      | registrar contato, resposta ou nota                    |
| `POST`  | `/search-jobs`               | criar busca de descoberta                              |
| `GET`   | `/search-jobs/:id`           | consultar progresso e erros                            |

## Convenções

- IDs: `cuid` interno; IDs de provedores ficam em `ExternalPlaceReference`.
- Paginação: `?cursor=<id>&limit=25`, máximo 100.
- Erros: `{ "code": "LEAD_DUPLICATE", "message": "...", "requestId": "..." }`.
- Toda escrita registra ator e gera `Activity` quando houver impacto comercial.
- A rota de descoberta retorna candidatos para revisão; apenas ação explícita cria leads.
