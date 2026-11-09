# Análise do backlog e próximo ciclo

Análise do [backlog no Notion](https://app.notion.com/p/bc7ff81ee55e41b7aee680f3d326cfe0?pvs=204), consultado em 9 de novembro de 2026. Este documento é um retrato de planejamento; os estados reais precisam ser confirmados antes de executar.

**Atualização de execução, 9 de novembro de 2026:** o cliente Prisma foi gerado e a API executou uma consulta de saúde em PostgreSQL temporário local. Sem configuração de banco, a API continua iniciando para uso demonstrativo e a rota de saúde do banco responde 503 seguro. O modelo Prisma foi corrigido para permitir a geração. A instância usada era temporária; a primeira migration, autenticação e CRUD de leads continuam pendentes. O Notion não foi atualizado.

## Recomendação: validar persistência real

A menor fatia de alto impacto é conectar a API a um PostgreSQL de desenvolvimento, gerar o Prisma Client e comprovar uma consulta de saúde real. Isso aproveita o trabalho já iniciado e prepara a primeira migration e a API persistente de leads.

### Estado registrado

- Inicialização da API NestJS, configuração tipada e healthcheck estão marcados como concluídos.
- [Módulo Prisma](https://app.notion.com/p/3fda9e77d28e81aaa9f7cc6954031848) está em andamento. O Notion registra o commit `543c8cc`, testes e verificações aprovados, mas a conexão real ainda não foi validada. A tentativa anterior de baixar Prisma engines recebeu HTTP 403.
- [PostgreSQL de desenvolvimento](https://app.notion.com/p/3f4a9e77d28e81e88afadf44f4bd3153) e [primeira migration](https://app.notion.com/p/3f4a9e77d28e81aca986d2f5aa0a5117) aparecem como não iniciados.
- [Pipeline](https://app.notion.com/p/3fda9e77d28e81b29a3cd9ed97385e0b) está em andamento como protótipo de interface em memória. Histórico persistente e ator real permanecem pendentes.

## Escopo e conclusão do próximo ciclo

1. Escolher e configurar uma instância PostgreSQL de desenvolvimento; manter credenciais fora do repositório.
2. Gerar o Prisma Client em um ambiente com acesso aos engines e configurar `DATABASE_URL` localmente.
3. Iniciar a API, executar uma consulta de saúde real e verificar que a ausência da configuração produz erro seguro.
4. Executar os testes e verificações pertinentes, incluindo lint e typecheck; registrar resultados e limitações.

**Concluído quando:** a conexão e consulta reais funcionam, o cliente foi gerado, a configuração ausente falha de modo seguro e as verificações pertinentes passam. Provisionar o banco sem validar a API não conclui a fatia.

## Dependências seguintes

- A primeira migration requer PostgreSQL e API configurados; seu critério é criar as tabelas principais e gerar o cliente.
- A [API inicial de leads](https://app.notion.com/p/3fda9e77d28e8190ab45cd31f7a67aa2) depende do módulo Prisma e da migration. A conclusão do contrato exige também autorização e isolamento.
- Autenticação e RBAC dependem da definição do provedor; conexão ao banco não substitui essa decisão. Autorização por organização depende de autenticação.
- Pipeline persistente depende da API de leads e de autenticação. Score, dossiê, guarda de contato e memória comercial dependem de outros componentes como evidências, atividades e pipeline.
- A direção de UX e o mapa de jornadas aparecem como não iniciados. A validação final de UX depende de telas e funcionalidades mais completas.

## Fora deste ciclo

CRUD completo e deduplicação; implementação completa de autenticação; pipeline persistente; score e evidências; integrações Google/OpenAI; mensagens; checklists finais e teste ponta a ponta. A migration é o próximo passo natural após comprovar a conexão e tem critério próprio.

As tarefas amplas de CRUD e score se sobrepõem a tarefas mais específicas. As regras de deduplicação registradas também diferem: reconciliar os critérios antes de implementá-las.

A consulta ao Notion não comprovou o estado atual do código ou da infraestrutura. O Notion não foi alterado por esta análise.
