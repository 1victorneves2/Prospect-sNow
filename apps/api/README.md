# API — Snowdrop Prospect

API NestJS do Snowdrop Prospect. A fundação atual inclui configuração de ambiente
validada, CORS para o frontend local, validação global de requisições e healthcheck.

## Executar

Na raiz do monorepo:

```bash
npm run dev:api
```

O healthcheck responde em `GET http://localhost:3000/v1/health`. Ele verifica se a
API está viva; a disponibilidade do banco será verificada quando o banco for
integrado.

Cada resposta inclui `X-Request-Id`. Os erros seguem o formato
`{ "code": "...", "message": "...", "requestId": "..." }`. Os logs HTTP registram
ID, método, rota, status e duração, sem corpo da requisição nem query string.

## Ordem para iniciar

1. Configurar `DATABASE_URL` e aplicar a primeira migração a partir de `../../prisma/schema.prisma`.
2. Implementar autenticação e RBAC antes de expor qualquer rota de leads.
3. Criar módulos na ordem: `auth`, `leads`, `pipeline`, `outreach`, `discovery`, `analysis`.

Os contratos, regras de domínio e rotas sugeridas estão em `../../docs/`.

## Limites obrigatórios

- Somente a API acessa Google Places e OpenAI.
- Busca no Google Places usa field masks e registra custo/erros em `SearchJob`.
- Dados de Places respeitam proveniência e retenção; não presumir armazenamento perpétuo.
- Não criar envio automático de WhatsApp nem campanhas em massa no MVP.
