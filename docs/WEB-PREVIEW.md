# Prévia do frontend

O frontend demonstrativo fica em `apps/web`. Para testar localmente:

```bash
npm ci
npm run dev --workspace=@snowdrop/web
```

Para validar uma versão compilada:

```bash
npm run build --workspace=@snowdrop/web
npm run preview --workspace=@snowdrop/web
```

O GitHub Pages exige um repositório público no plano GitHub atual. O proprietário tornou o repositório público em 15/10/2026 para publicar esta prévia. A publicação usa `.github/workflows/pages.yml` na branch `work`; o build ajusta a base do Vite para `/Prospect-sNow/`.

Após mudar a visibilidade em **Settings → General → Danger Zone → Change repository visibility**, configurar **Settings → Pages → Build and deployment → Source: GitHub Actions**. Enviar um commit à branch `work` ou executar manualmente o workflow `Publish web preview`. Confirmar que o job `deploy` terminou com sucesso e abrir <https://1victorneves2.github.io/Prospect-sNow/>. A URL não deve ser considerada publicada antes dessa verificação.

Se o repositório voltar a ser privado no mesmo plano, o GitHub Pages poderá deixar de publicar ou servir a página. Nesse caso, usar outra hospedagem para manter a prévia disponível.

A interface usa dados fictícios em memória. Ainda não há login, banco, API conectada nem integrações externas. Não incluir segredos ou dados reais no frontend ou em variáveis `VITE_*`.
