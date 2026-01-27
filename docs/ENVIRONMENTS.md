# Environment Configuration

This project uses separate Supabase projects for development and production to prevent accidental data corruption and enable safe testing.

## Environment Structure

| Environment | Supabase Project | When Used |
|-------------|------------------|-----------|
| Local (dev) | `listopad-dev` | `pnpm dev` on your machine |
| Preview | `listopad-dev` | Vercel preview deployments (PRs) |
| Production | `listopad` | Main branch deployment |

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
   NEXT_PUBLIC_LISTOPAD__SUPABASE_URL=https://your-dev-project.supabase.co
   NEXT_PUBLIC_LISTOPAD__SUPABASE_ANON_KEY=your-dev-anon-key
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

## Creating a Dev Supabase Project

If you don't have a dev Supabase project yet:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **New project**
3. Name it `listopad-dev` (or similar - must contain "dev" for seed script safety)
4. Choose the same region as production for consistency
5. Wait for the project to be created
6. Run the schema SQL from `docs/DATABASE-SEEDING.md` in the SQL Editor

## Environment Variables

### Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_LISTOPAD__SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_LISTOPAD__SUPABASE_ANON_KEY` | Supabase anon (public) key |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `LISTOPAD__SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations |

## Vercel Configuration

Configure environment variables in **Vercel Dashboard > Project > Settings > Environment Variables**.

### Production Environment

Set these for **Production** only:

```
NEXT_PUBLIC_LISTOPAD__SUPABASE_URL = https://your-prod-project.supabase.co
NEXT_PUBLIC_LISTOPAD__SUPABASE_ANON_KEY = <prod-anon-key>
LISTOPAD__SUPABASE_SERVICE_ROLE_KEY = <prod-service-role-key> (optional)
```

### Preview Environment

Set these for **Preview** (and optionally Development):

```
NEXT_PUBLIC_LISTOPAD__SUPABASE_URL = https://your-dev-project.supabase.co
NEXT_PUBLIC_LISTOPAD__SUPABASE_ANON_KEY = <dev-anon-key>
LISTOPAD__SUPABASE_SERVICE_ROLE_KEY = <dev-service-role-key> (optional)
```

This ensures:
- PR preview deployments use the dev database (safe to test with)
- Production deployments use the prod database (real data)

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm validate-env` | Check that required env vars are set |
| `pnpm db:seed` | Seed dev database with sample data |

### db:seed Safety

The `db:seed` script has a safety check that **refuses to run** if your Supabase URL looks like production. It only runs if the URL contains one of:
- `-dev`
- `localhost`
- `127.0.0.1`
- `local`
- `staging`
- `test`

This prevents accidentally seeding/overwriting production data.

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

The `db:seed` script detected a production-like URL. Either:
- Use a dev Supabase project with "dev" in the URL
- Create a new dev project following the steps above

### Preview deployment showing wrong data

Check that Vercel environment variables are configured correctly:
1. Production should point to prod Supabase
2. Preview should point to dev Supabase

Go to **Vercel Dashboard > Project > Settings > Environment Variables** to verify.
