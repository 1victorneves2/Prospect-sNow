# Busca Google Places no Sites

A versão privada hospedada no Sites possui busca por segmento e localidade usando
Places API (New), revisão de até 10 resultados e salvamento de oportunidades por
usuário. A busca é acionada manualmente e limitada a 30 tentativas por usuário em
uma janela de 24 horas, com intervalo mínimo de 10 segundos. Consultas podem gerar
cobranças do Google; configure orçamento e limites no Google Cloud.

## Configuração necessária

1. No Google Cloud, selecione ou crie um projeto, verifique o faturamento e habilite
   **Places API (New)**. Em **APIs e serviços → Credenciais**, verifique se já existe
   uma chave apropriada ou crie uma, restringindo-a à API necessária.
2. Configure a chave como segredo de servidor `GOOGLE_MAPS_API_KEY` nas configurações
   de ambiente do Site. Não coloque a chave no Git, no frontend ou neste documento.
3. Publique novamente a versão do Site para que a revisão do segredo seja aplicada.
   Pesquise uma empresa de teste, revise e salve um resultado para validar a integração.

Referências: [configuração da Places API](https://developers.google.com/maps/documentation/places/web-service/get-api-key),
[Text Search](https://developers.google.com/maps/documentation/places/web-service/text-search)
e [preços e uso](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing).

## Arquitetura e limites

- `site-worker/index.mjs` roda no servidor do Site. A identidade é fornecida pelo
  Sites; as operações exigem usuário e o armazenamento é isolado por identificador.
- A chave é usada exclusivamente no servidor. A consulta solicita somente ID, nome e
  endereço, sem consultar informações adicionais automaticamente.
- O banco D1 armazena apenas o ID do lugar e uma referência opcional escrita pelo
  usuário, não o nome ou endereço recebidos do Google. Dados atualizados são abertos
  no Google Maps. Resultados brutos não são persistidos automaticamente.
- A interface de busca real e a lista salva são separadas das telas demonstrativas.
  A integração do Sites usa D1 e não configura o PostgreSQL da API NestJS original.
- As migrações D1 em `drizzle/` são versionadas; não altere migrações já aplicadas.
- A versão estática antiga era uma prévia. As demais telas de dashboard, pipeline e
  mensagens ainda usam dados fictícios e não foram ligadas ao armazenamento real.

Para desenvolvimento, `npm run test:sites` verifica a camada de servidor com SQLite em
memória e resposta fictícia do Google. `npm run build:sites` constrói o Worker a partir
do frontend. A publicação no Sites exige o manifesto próprio da conta, a configuração
de D1 e o fluxo de publicação do serviço; não reutilize identidades de outros Sites.

Confira as [políticas de Places](https://developers.google.com/maps/documentation/places/web-service/policies)
para atribuição e armazenamento antes de ampliar os campos exibidos ou persistidos.
