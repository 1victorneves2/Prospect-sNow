# Instalação em outro computador

Este guia prepara um ambiente de desenvolvimento no Windows usando PowerShell. O código
fica no GitHub; o banco e as credenciais são locais e precisam ser configurados novamente.

## Pré-requisitos

- Git, Node.js 24 e npm 10 ou superior.
- PostgreSQL 16 disponível localmente, com um usuário autorizado a acessar um banco
  vazio de desenvolvimento. Crie um banco chamado `snowdrop_dev` com as ferramentas da
  sua instalação PostgreSQL. Use um banco exclusivo de desenvolvimento.
- Acesso ao repositório e à internet para instalar dependências e gerar o Prisma Client.

## Obter e preparar o projeto

No PowerShell, escolha a pasta onde deseja guardar o projeto e execute:

```powershell
git clone https://github.com/1victorneves2/Prospect-sNow.git
cd Prospect-sNow
npm ci
npx prisma generate --schema prisma/schema.prisma
```

Se a geração do Prisma Client falhar por bloqueio de download, verifique a conexão e o
acesso aos binários do Prisma e execute novamente o último comando.

## Configurar e aplicar as migrações

Na mesma janela do PowerShell, informe a URL da sua própria instância. Substitua os
valores entre colchetes pelas credenciais e pelo endereço configurados no PostgreSQL:

```powershell
$env:DATABASE_URL = 'postgresql://[usuario]:[senha]@localhost:5432/snowdrop_dev?schema=public'
npx prisma migrate deploy --schema prisma/schema.prisma
npx prisma migrate status --schema prisma/schema.prisma
```

Se a senha contiver caracteres especiais, codifique-os para uso em URL. A variável
existe apenas na janela atual; configure-a novamente em outra sessão. Não compartilhe
a URL nem salve credenciais no Git. Execute migrações somente no banco pretendido;
`migrate deploy` aplica migrações existentes, sem criar dados demonstrativos.

## Iniciar e verificar

Com `DATABASE_URL` ainda configurada, inicie a API:

```powershell
npm run dev:api
```

Em outra janela, abra <http://localhost:3000/v1/health> para verificar a API e
<http://localhost:3000/v1/health/database> para verificar uma consulta ao banco.
O segundo endereço deve responder com status 200 e `{"status":"ok"}`. Sem banco
configurado ou disponível, responde 503; a API pode iniciar sem banco para a prévia.

Para iniciar a interface, abra outro PowerShell na pasta do projeto:

```powershell
npm run dev
```

Abra o endereço local informado pelo terminal. A interface ainda usa dados
demonstrativos; autenticação e CRUD de leads ainda não estão conectados.

## Validar e preservar dados

Na raiz do projeto, `npm test`, `npm run lint`, `npm run typecheck` e `npm run build`
executam as verificações principais. Para atualizar uma cópia já clonada, confira se não
há alterações locais a preservar e use `git pull` antes de instalar dependências e
aplicar novas migrações.

O GitHub guarda código, histórico e migrações; **não guarda o conteúdo do PostgreSQL,
arquivos `.env`, senhas ou outras credenciais locais**. Caso haja dados que precise
preservar, faça e teste um backup separado do banco antes de apagar ou trocar de
computador. Nunca publique esse backup ou segredos no repositório público.
