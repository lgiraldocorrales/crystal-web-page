# Crystal corporate website

Maintainable bilingual corporate website built with Astro static generation and a minimal Flask delivery layer for secure contact email.

## Why this architecture

- Static HTML by default for SEO, accessibility and performance.
- Typed content and one canonical route inventory.
- Reusable `.astro` components instead of HTML strings.
- No client hydration unless a future feature genuinely requires it.
- Central metadata, hreflang, schema and sitemap rules.
- Python secrets stay server-side and deploy cleanly to Azure App Service.

## Local development

Requirements: Node 22.12+ and Python 3.12.

```bash
npm install
npm run dev
```

For the complete Flask-served build:

```powershell
npm run build
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m flask --app app run --port 8000
```

In Windows Command Prompt use `.venv\Scripts\activate`; on macOS/Linux use
`source .venv/bin/activate`. Gunicorn is intentionally reserved for the Linux
App Service runtime because it depends on Unix modules unavailable on Windows.

## Quality checks

```bash
npm run test
python -m unittest discover -s tests -p "test_*.py"
npm audit --omit=dev
```

## Environment

Copy `.env.example` to `.env` for local testing. Never commit credentials. Turnstile requires both the public site key at build time and the secret key at runtime.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Azure deployment](docs/AZURE_DEPLOYMENT.md)
- [Temporary GitHub Pages preview](docs/GITHUB_PAGES.md)

The component interfaces use JSDoc for IntelliSense, frontmatter explains server/build-time logic, and source comments document why no `client:*` hydration is needed.
