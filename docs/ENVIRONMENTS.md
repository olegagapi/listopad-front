# Environment Configuration

This project uses **two separate Vercel projects** and **two Supabase projects** to fully isolate staging from production.

## Architecture

```
main (trunk) ──push──→ listopad-stage (Vercel, auto-deploy)
     │
     └── tag v* ──manual──→ Vercel deploy hook ──→ listopad-prod (Vercel)
```

## Environment Structure

| Environment | Vercel Project | Trigger | Supabase | Meilisearch |
|-------------|----------------|---------|----------|-------------|
| Local | — | `pnpm dev` | listopad-dev | localhost / none |
| Staging | `listopad-stage` | Push to `main` | listopad-dev | none (browse mode) |
| Production | `listopad-prod` | Deploy hook (on tag) | listopad-prod | Meilisearch Cloud |

Staging has **no Meilisearch** — search gracefully degrades to browse mode (Supabase-only filtering).

## Quick Start (Local Development)

1. **Copy the template**
   ```bash
   cp .env.example .env.local
   ```

2. **Get your dev Supabase credentials**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your **dev** project (e.g., `listopad-dev`)
   - Go to **Project Settings > API**
   - Copy the URL and anon key

3. **Fill in `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
   ```

4. **Validate your setup**
   ```bash
   pnpm validate-env
   ```

5. **Seed the dev database** (optional)
   ```bash
   pnpm db:seed
   ```

6. **Start development**
   ```bash
   pnpm dev
   ```

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |

### Optional

| Variable | Description | Where Used |
|----------|-------------|------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin ops | Local, both Vercel projects |
| `MEILISEARCH_HOST` | Meilisearch host URL | Local (optional), prod only |
| `MEILISEARCH_ADMIN_API_KEY` | Admin key for indexing | Prod only |
| `MEILISEARCH_SEARCH_API_KEY` | Read-only search key | Prod only |
| `OPENAI_API_KEY` | OpenAI key for hybrid search | Prod only |
| `SUPABASE_WEBHOOK_SECRET` | Webhook auth for sync | Prod only |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | Both Vercel projects |

## Vercel Configuration

### Staging (`listopad-stage`)

- **Repo**: same GitLab repo
- **Production branch**: `main`
- **Auto-deploy**: enabled (every push to `main`)

Env vars (scope: Production + Preview):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<listopad-dev>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | dev anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | dev service role key |
| `NEXT_PUBLIC_SITE_URL` | staging domain URL |

No Meilisearch vars — search falls back to browse mode automatically.

### Production (`listopad-prod`)

- **Repo**: same GitLab repo
- **Production branch**: `main`
- **Auto-deploy**: disabled — deploys only via deploy hook
- **Deploy hook**: Settings > Git > Deploy Hooks > `production-release` (branch: `main`)

Env vars (scope: Production):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<listopad-prod>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | prod anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | prod service role key |
| `MEILISEARCH_HOST` | prod Meilisearch Cloud host |
| `MEILISEARCH_ADMIN_API_KEY` | prod admin key |
| `MEILISEARCH_SEARCH_API_KEY` | prod search key |
| `OPENAI_API_KEY` | OpenAI key |
| `SUPABASE_WEBHOOK_SECRET` | prod webhook secret |
| `NEXT_PUBLIC_SITE_URL` | production domain URL |

## Release Workflow

```bash
# 1. Work on main as usual
git push origin main          # → auto-deploys to staging

# 2. When ready to release, tag and trigger deploy
git tag v1.2.3
git push origin v1.2.3

# 3. Trigger prod deploy via hook
curl -X POST https://api.vercel.com/v1/integrations/deploy/<HOOK_ID>
```

The deploy hook deploys the latest `main` HEAD. Create the tag and call the hook without pushing other commits in between. The tag serves as a release marker in git history.

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm validate-env` | Check that required env vars are set |
| `pnpm db:seed` | Seed dev database with sample data |

### db:seed Safety

The `db:seed` script **refuses to run** if your Supabase URL looks like production. It only runs if the URL contains one of: `-dev`, `localhost`, `127.0.0.1`, `local`, `staging`, `test`.

## File Structure

```
.env.example          # Template (committed to git)
.env.local            # Your local dev credentials (git-ignored)
```

**Never commit** `.env.local` or any file containing real credentials.

## Troubleshooting

### "Missing Supabase environment variables"

1. Ensure `.env.local` exists
2. Run `pnpm validate-env` to see which variables are missing
3. Copy values from your Supabase dashboard

### "This script refuses to run on production databases"

The `db:seed` script detected a production-like URL. Use a dev Supabase project with "dev" in the URL, or create a new dev project.

### Staging has no search

This is expected. Staging runs without Meilisearch — the shop page falls back to Supabase-only browse mode. Search is only available in production.
