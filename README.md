# Snowdrop Prospect

Central interna de inteligência comercial para descobrir, analisar, priorizar e acompanhar oportunidades da Snowdrop.

## Estado atual

Esta primeira entrega implementa a base visual navegável do MVP com dados demonstrativos claramente isolados:

- Visão comercial com indicadores, funil e alertas.
- Descoberta de empresas com formulário de busca preparado para a futura integração oficial do Google Places.
- Base de leads com filtro, score explicável e painel de detalhes/evidências.
- Mensagem comercial para revisão e aprovação humana.
- Pipeline comercial com movimentação de etapa em memória.

A API NestJS possui configuração tipada e módulo Prisma. A conexão com PostgreSQL pode ser validada localmente; os dados da interface ainda são demonstrativos e não há CRUD persistente, autenticação, Google Places ou OpenAI conectados. Mantenha chaves de API fora do navegador.

## Executar

```bash
npm install
npm run dev
```

Para iniciar a API em outro terminal:

```bash
npm run dev:api
```

O healthcheck da API está disponível em `http://localhost:3000/v1/health`.
Para validar um PostgreSQL de desenvolvimento, configure `DATABASE_URL` no ambiente da API, execute `npx prisma generate --schema prisma/schema.prisma` na raiz e consulte `http://localhost:3000/v1/health/database`. A resposta é 200 após uma consulta real; sem banco configurado ou disponível, a verificação responde 503 sem detalhes da conexão. Não coloque credenciais no repositório.

Para gerar o build de produção:

```bash
npm run build
```

## Qualidade

Use Node 24 (definido em `.nvmrc`) e execute os comandos a partir da raiz:

```bash
npm run lint
npm test
npm run typecheck
npm run format:check
```

O hook de pre-commit formata e aplica lint nos arquivos alterados. A integração contínua executa lint, testes, tipagem e build a cada push ou pull request.

## Próxima etapa técnica

Aplicar a primeira migration em um PostgreSQL de desenvolvimento e implementar autenticação e CRUD de leads antes de habilitar integrações externas. Veja [a análise do próximo ciclo](docs/PROXIMO-CICLO.md).

## Base técnica planejada

O repositório já contém o desenho da estrutura a ser implementada:

- [Arquitetura](docs/ARCHITECTURE.md)
- [Contrato de API](docs/API-CONTRACT.md)
- [Plano de implementação](docs/IMPLEMENTATION-PLAN.md)
- [Segurança e dados](docs/SECURITY-AND-DATA.md)
- [Modelo Prisma](prisma/schema.prisma)
- [Guia da API](apps/api/README.md)
