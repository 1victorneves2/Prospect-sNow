# Plano de implementação

## Marco 0 — preparado agora

- [x] Monorepo, web demonstrativa e CI.
- [x] Modelo Prisma e documento de arquitetura.
- [x] Variáveis de ambiente sem segredos.
- [x] Regras de evidência, LGPD e aprovação humana documentadas.

## Marco 1 — fundação executável

1. Provisionar PostgreSQL de desenvolvimento e preencher apenas `DATABASE_URL` local.
2. Inicializar NestJS em `apps/api`.
3. Instalar Prisma, gerar cliente e criar a primeira migration.
4. Implementar healthcheck, configuração tipada, logger com redaction e tratamento de erros.
5. Escolher provedor de autenticação e implementar RBAC (`ADMIN`, `MEMBER`).
6. Substituir os dados demonstrativos por `GET /v1/leads` e CRUD de leads.

Critério: usuário autenticado cria/edita lead e vê histórico após reiniciar o serviço.

## Marco 2 — pipeline

1. Transições de status validadas.
2. Atividades, oportunidade, próximo passo e lembretes de follow-up.
3. Bloqueio de duplicidade e de `doNotContact`.
4. Indicadores calculados no backend.

## Marco 3 — descoberta e inteligência

1. Adicionar chave Google Places somente ao backend.
2. Usar Places API (New), field masks mínimas e custo por `SearchJob`.
3. Tela de revisão/importação e deduplicação por `placeId`.
4. Score determinístico com pesos versionados.
5. IA gera diagnóstico e rascunho a partir das evidências; usuário edita e aprova.

## Marco 4 — qualidade e publicação

1. Testes unitários para score, deduplicação e transições de pipeline.
2. Testes de integração da API com banco temporário.
3. Auditoria de autorização, rate limiting, LGPD e logs.
4. Deploy de preview, monitoramento e backup do banco.

## Primeiro teste ponta a ponta

Pesquisar lojas de moda em Manaus; importar uma empresa; registrar pelo menos uma
evidência; gerar score e recomendação; aprovar mensagem; abrir WhatsApp manualmente;
registrar a atividade e avançar a etapa comercial.
