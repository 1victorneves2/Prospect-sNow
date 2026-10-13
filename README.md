# Snowdrop Prospect

Central interna de inteligência comercial para descobrir, analisar, priorizar e acompanhar oportunidades da Snowdrop.

## Estado atual

Esta primeira entrega implementa a base visual navegável do MVP com dados demonstrativos claramente isolados:

- Visão comercial com indicadores, funil e alertas.
- Descoberta de empresas com formulário de busca preparado para a futura integração oficial do Google Places.
- Base de leads com filtro, score explicável e painel de detalhes/evidências.
- Mensagem comercial para revisão e aprovação humana.
- Pipeline comercial com movimentação de etapa em memória.

Ainda não há persistência, autenticação, Google Places ou OpenAI conectados. Essas integrações devem ser implementadas no backend, mantendo chaves de API fora do navegador.

## Executar

```bash
npm install
npm run dev
```

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

Adicionar a API NestJS, PostgreSQL e Prisma para persistir as entidades do documento mestre (`Lead`, `LeadEvidence`, `LeadAnalysis`, `OutreachDraft`, `Activity`, `Opportunity` e `SearchJob`), antes de habilitar integrações externas.

## Base técnica planejada

O repositório já contém o desenho da estrutura a ser implementada:

- [Arquitetura](docs/ARCHITECTURE.md)
- [Contrato de API](docs/API-CONTRACT.md)
- [Plano de implementação](docs/IMPLEMENTATION-PLAN.md)
- [Segurança e dados](docs/SECURITY-AND-DATA.md)
- [Modelo Prisma](prisma/schema.prisma)
- [Guia da API](apps/api/README.md)
