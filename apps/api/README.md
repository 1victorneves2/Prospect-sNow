# API — Snowdrop Prospect

API NestJS do Snowdrop Prospect. A fundação atual inclui configuração de ambiente
validada, CORS para o frontend local, validação global de requisições e healthcheck.

## Executar

Na raiz do monorepo:

```bash
npm run dev:api
```

O healthcheck `GET http://localhost:3000/v1/health` verifica se a API está viva.
`GET /v1/health/database` executa uma consulta simples ao PostgreSQL: responde 200
quando o banco está acessível ou 503 sem detalhes de conexão quando não está. A API
pode iniciar sem `DATABASE_URL` para a prévia local, mas a verificação do banco falha.

Cada resposta inclui `X-Request-Id`. Os erros seguem o formato
`{ "code": "...", "message": "...", "requestId": "..." }`. Os logs HTTP registram
ID, método, rota, status e duração, sem corpo da requisição nem query string.

## Autorização em preparação

As rotas são privadas por padrão; apenas as rotas de saúde foram marcadas como públicas.
O verificador de identidade padrão recusa todos os tokens: login e acesso a dados reais
ainda não estão disponíveis. Não há provedor de autenticação escolhido ou configurado.
O adaptador futuro deve validar a sessão e retornar usuário, organização e papel confiáveis.
Os guardas de papel e as funções de escopo por organização são uma base para as próximas
rotas: cada consulta de recurso deve aplicar o escopo da identidade verificada. Eles não
substituem essa filtragem no banco nem implementam o CRUD ou login.

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
