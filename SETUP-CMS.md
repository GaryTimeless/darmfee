# Decap CMS Auth-Setup

> Status: Noch ausstehend. Ohne Auth läuft das CMS nicht — der Admin zeigt nur die Login-Seite.

## Kontext

Decap CMS braucht einen OAuth-Proxy, um mit GitHub zu sprechen. Der Proxy läuft auf Vercel (kostenlos) und vermittelt zwischen dem Browser (wo Christine sich einloggt) und der GitHub-API (wo die Commits landen).

## Schritt 1: GitHub OAuth App registrieren

1. Geh zu https://github.com/settings/developers
2. Klick **"New OAuth App"**
3. Füll aus:
   - **Application name:** `DARMbalance CMS`
   - **Homepage URL:** `https://darmbalance.de`
   - **Authorization callback URL:** `https://DEIN-VERCEL-NAME.vercel.app/callback`
     - (Den genauen Namen kriegst du erst nach dem Vercel-Deploy in Schritt 2. Erstmal irgendwas eintragen, wir fixen das später.)
4. Klick **"Register application"**
5. Notier dir **Client ID** und generier ein **Client Secret** (Button "Generate a new client secret")

## Schritt 2: OAuth-Proxy auf Vercel deployen

1. Geh zu https://github.com/vencax/netlify-cms-github-oauth-provider
2. Klick den **"Deploy to Vercel"** Button (oder geh auf https://vercel.com, importier das Repo manuell)
3. Beim Deployment setzt du diese **Environment Variables**:
   - `OAUTH_CLIENT_ID` = deine GitHub Client ID aus Schritt 1
   - `OAUTH_CLIENT_SECRET` = dein GitHub Client Secret aus Schritt 1
   - `REDIRECT_URL` = `https://DEIN-VERCEL-NAME.vercel.app/callback` (die URL, die Vercel dir gibt)
   - `ORIGIN` = `https://darmbalance.de`
4. Nach erfolgreichem Deploy kopierst du die Vercel-URL (z.B. `https://darmbalance-oauth.vercel.app`)

## Schritt 3: Callback-URL fixen

1. Zurück zur GitHub OAuth App (https://github.com/settings/developers)
2. Authorization callback URL updaten auf die echte: `https://DEIN-VERCEL-URL.vercel.app/callback`
3. Speichern

## Schritt 4: config.yml updaten

In `/admin/config.yml` diese Zeile:

```yaml
base_url: https://YOUR-PROXY.vercel.app
```

Ersetzen mit deiner echten Vercel-URL:

```yaml
base_url: https://darmbalance-oauth.vercel.app
```

Dann commiten und pushen.

## Schritt 5: Testen

1. Geh auf `https://darmbalance.de/admin/`
2. Klick **"Login with GitHub"**
3. Authorisiere die App
4. Du solltest im CMS-Editor landen und die "Website-Inhalte" sehen können

## Schritt 6: Christine einweisen

- URL: `https://darmbalance.de/admin/`
- Login: Ihr GitHub-Account (den musst du als Collaborator im Repo `GaryTimeless/darmbalance` hinzufügen, falls nicht schon geschehen)
- Workflow: Text ändern → "Publish" klicken → ~30 Sekunden warten → Live auf darmbalance.de

## Troubleshooting

- **"Failed to load config"**: `config.yml` hat einen Syntax-Fehler. Mit YAML-Validator prüfen.
- **Login redirect klappt nicht**: Callback-URL in GitHub OAuth App prüfen. Muss exakt mit der Vercel-URL + `/callback` übereinstimmen.
- **"Failed to persist entry"**: Branch `gh-pages` existiert und der GitHub-User hat Schreibrechte auf das Repo.
- **CMS lädt aber zeigt nichts**: `data/site.json` existiert im Repo und ist gültiges JSON.
