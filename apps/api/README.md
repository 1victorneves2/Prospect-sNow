# API — implementação planejada

Esta pasta é reservada à API NestJS do Snowdrop Prospect. Ela ainda não contém uma
aplicação executável, para evitar uma base com credenciais e integrações parcialmente
configuradas.

## Ordem para iniciar

1. Inicializar NestJS nesta pasta com TypeScript estrito.
2. Instalar `@prisma/client`, `prisma`, `zod`, `@nestjs/config`, autenticação e testes.
3. Configurar `DATABASE_URL` e aplicar a primeira migração a partir de `../../prisma/schema.prisma`.
4. Implementar autenticação e RBAC antes de expor qualquer rota de leads.
5. Criar módulos na ordem: `health`, `auth`, `leads`, `pipeline`, `outreach`, `discovery`, `analysis`.

Os contratos, regras de domínio e rotas sugeridas estão em `../../docs/`.

## Limites obrigatórios

- Somente a API acessa Google Places e OpenAI.
- Busca no Google Places usa field masks e registra custo/erros em `SearchJob`.
- Dados de Places respeitam proveniência e retenção; não presumir armazenamento perpétuo.
- Não criar envio automático de WhatsApp nem campanhas em massa no MVP.
