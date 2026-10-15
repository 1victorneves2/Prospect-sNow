# Prévia do frontend no GitHub Pages

A publicação da branch `work` usa `.github/workflows/pages.yml` para gerar e enviar apenas `apps/web/dist` ao GitHub Pages. O build define `GITHUB_PAGES=true`, que ajusta o caminho base do Vite para `/Prospect-sNow/`.

URL esperada após o deploy: <https://1victorneves2.github.io/Prospect-sNow/>.

Essa é uma prévia pública e demonstrativa: empresas, scores, mensagens e etapas são exemplos fictícios em memória. Não há login, banco, API ou integrações externas. Não inserir segredos, dados comerciais reais ou chaves `VITE_*` nesse frontend.

## Publicar uma alteração

1. Atualizar a branch `work` e executar os testes e o build do projeto.
2. Fazer push para `work`. Alterações em `apps/web`, no lockfile ou no workflow iniciam `Publish web preview` em GitHub Actions.
3. Conferir o resultado do workflow e abrir a URL acima. O deploy só está concluído quando o job `deploy` terminar com sucesso.

## Voltar à versão anterior

Reverter o commit na branch `work` e fazer push. O workflow publica novamente o estado da branch. Essa operação afeta apenas a prévia do frontend.

Se o GitHub Pages ainda não estiver habilitado, um administrador do repositório deve selecionar **Settings → Pages → Build and deployment → GitHub Actions**. Repositórios privados podem exigir um plano GitHub compatível com Pages.
