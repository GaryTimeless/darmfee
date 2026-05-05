# Decap CMS Auth-Setup

> Status: Erledigt. CMS funktioniert unter https://garytimeless.github.io/darmbalance/admin/

## Verwendete Zugangsdaten

- **GitHub OAuth App**: DARMbalance CMS
- **Homepage URL**: `https://garytimeless.github.io/darmbalance`
- **Callback URL**: `https://darmbalance-oauth-proxy.vercel.app/callback`
- **OAuth Proxy (Vercel)**: `darmbalance-oauth-proxy.vercel.app`
- **GitHub Repo**: `GaryTimeless/darmbalance` (Branch: `gh-pages`)

## Schritt 1: GitHub OAuth App registrieren

1. Geh zu https://github.com/settings/developers
2. Klick **"New OAuth App"**
3. Ausfüllen:
   - **Application name:** `DARMbalance CMS`
   - **Homepage URL:** `https://garytimeless.github.io/darmbalance`
   - **Authorization callback URL:** `https://darmbalance-oauth-proxy.vercel.app/callback`
4. Klick **"Register application"**
5. **Client ID** notieren, **Client Secret** generieren

## Schritt 2: OAuth-Proxy auf Vercel deployen

1. Geh auf https://vercel.com → **New Project**
2. GitHub-Repo `ublabs/netlify-cms-oauth` importieren
3. **Repository Name**: `darmbalance-oauth-proxy`
4. **Deploy** (erstmal ohne Env-Vars)
5. Nach dem Deploy: Settings → Environment Variables:
   - `OAUTH_GITHUB_CLIENT_ID` = Client ID
   - `OAUTH_GITHUB_CLIENT_SECRET` = Client Secret
6. **Redeploy**

## Schritt 3: config.yml

In `/admin/config.yml`:

```yaml
backend:
  name: github
  repo: GaryTimeless/darmbalance
  branch: gh-pages
  base_url: https://darmbalance-oauth-proxy.vercel.app
  auth_endpoint: /auth
```

## Schritt 4: Christine einweisen

- URL: `https://garytimeless.github.io/darmbalance/admin/`
- Login: Ihr GitHub-Account (muss Collaborator im Repo `GaryTimeless/darmbalance` sein)
- Workflow: Text ändern → "Publish" klicken → ~30 Sekunden warten → Live

## Troubleshooting

- **"Failed to load config"**: `config.yml` hat einen Syntax-Fehler
- **Login redirect klappt nicht**: Callback-URL in GitHub OAuth App muss exakt `https://darmbalance-oauth-proxy.vercel.app/callback` sein
- **"Failed to persist entry"**: GitHub-User braucht Schreibrechte auf das Repo
- **OAuth Proxy 500er**: Environment Variables auf Vercel prüfen. Ohne `?provider=github` gibt der Endpunkt einen 500er — das ist normal.
- **CMS lädt aber zeigt nichts**: `data/site.json` existiert im Repo und ist gültiges JSON
