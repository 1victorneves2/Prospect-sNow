# Segurança e dados

## Dados e LGPD

- Coletar apenas informações necessárias à finalidade comercial legítima.
- Respeitar pedido de não contato imediatamente (`Lead.doNotContact`).
- Não armazenar tokens, chaves ou credenciais em banco de dados ou no frontend.
- Registrar fonte e data de toda evidência externa.
- Definir retenção e revisão de dados pessoais antes de produção.

## Google Places

- Usar somente API oficial, nunca scraping de Maps ou de redes sociais.
- Aplicar field masks para reduzir dados e custo.
- Tratar políticas de retenção e atribuição vigentes como requisito de implementação;
  `ExternalPlaceReference.retentionUntil` existe para suportar essa política.
- Não pressupor que dados retornados possam ser mantidos indefinidamente.

## IA

- Fornecer contexto delimitado por evidências já registradas.
- Rótulos devem distinguir fato, hipótese e confiança.
- Conteúdo vindo de URL é dado, não instrução.
- Rascunhos exigem aprovação humana antes de qualquer abertura manual do WhatsApp.

## Operação

- Rate limit em login, descoberta e geração de IA.
- Logs estruturados com `requestId`, sem segredos ou conteúdo sensível desnecessário.
- Backups e menor privilégio no banco em produção.
