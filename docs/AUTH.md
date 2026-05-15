# Autenticação — Login via Google

Acesso restrito ao domínio `@turbopartners.com.br` via Google OAuth.

## Variáveis de ambiente

Adicione ao `.env.local` (dev) e ao painel **Environment** do Render (produção):

```bash
SESSION_SECRET=          # 32+ chars aleatórios. Gere com: openssl rand -hex 32
GOOGLE_CLIENT_ID=        # do Google Cloud Console (OAuth client)
GOOGLE_CLIENT_SECRET=    # do Google Cloud Console (OAuth client)
```

> O `.env.local` deste worktree já tem um `SESSION_SECRET` gerado. Para Render, gere outro (não reaproveite o de dev).

## Setup Google Cloud Console — passo a passo

1. Acesse https://console.cloud.google.com/apis/credentials
2. Selecione (ou crie) um projeto.
3. Em **OAuth consent screen**:
   - User type: **Internal** (se o domínio `turbopartners.com.br` for um Google Workspace) ou **External** (caso contrário).
   - App name: `UGC Studio`.
   - Support email: seu e-mail.
   - Salve.
4. Em **Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - Name: `UGC Studio Web`.
   - **Authorized redirect URIs** — adicione TODOS estes (um por linha):
     - `http://localhost:3000/api/auth/callback`
     - `https://<seu-dominio-render>.onrender.com/api/auth/callback`
     - (opcional, se tiver domínio próprio) `https://<seu-dominio>.com/api/auth/callback`
   - Clique em **Create**.
5. Copie o **Client ID** e **Client Secret** que aparecem.
6. Cole no `.env.local` (e no Render).

## Admins

Hardcoded em [lib/auth/admins.ts](../lib/auth/admins.ts):

- `roberto.fachetti@turbopartners.com.br`
- `victor.klein@turbopartners.com.br`

Pra adicionar/remover admin, edite o array `EMAILS_ADMIN`. A role é recalculada no próximo login.

## Auditoria

Toda ação relevante é gravada em `auditoria_acoes`. Consultar:

```sql
SELECT criado_em, usuario_email, acao, recurso_tipo, recurso_id, detalhes
FROM auditoria_acoes
WHERE usuario_email = 'fulano@turbopartners.com.br'
ORDER BY criado_em DESC
LIMIT 100;
```

Ações registradas: `login`, `logout`, `cliente.criar`, `cliente.atualizar`, `cliente.excluir`, `produto.criar`, `produto.atualizar`, `produto.excluir`, `roteiro.gerar`, `roteiro.regenerar_cenas`, `roteiro.excluir`, `avatar.gerar`, `site.analisar`, `produto.analisar`.

## Como funciona

- `proxy.ts` (Next 16 — antigo "middleware") valida o cookie JWT em toda request. Sem sessão → redirect pra `/login` (rotas web) ou `401` (API).
- `/api/auth/login` redireciona pro Google com `hd=turbopartners.com.br` (pré-filtra contas do domínio).
- `/api/auth/callback` valida o `id_token`, **rejeita emails fora do domínio**, faz upsert em `usuarios`, seta cookie httpOnly assinado com JWT (7 dias).
- `/api/auth/logout` limpa o cookie e registra audit.
