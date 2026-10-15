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

O GitHub Pages não está disponível para este repositório privado no plano GitHub atual: **Settings → Pages** exige upgrade ou repositório público. O workflow de Pages foi retirado após duas execuções bloqueadas. Manter o repositório privado é a decisão vigente; não tentar reativar o workflow sem revisar o plano de hospedagem.

A interface usa dados fictícios em memória. Ainda não há login, banco, API conectada nem integrações externas. Não incluir segredos ou dados reais no frontend ou em variáveis `VITE_*`.
