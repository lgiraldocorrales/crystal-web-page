# Azure App Service deployment

## App Service

- Operating system: Linux.
- Runtime stack: Python 3.12.
- Startup command: `gunicorn --config gunicorn.conf.py app:app`.
- Health-check path: `/health`.
- HTTPS Only: enabled.
- Minimum TLS: 1.2 or newer.
- FTPS and remote debugging: disabled.

Node is a build-time dependency only. GitHub Actions uses Node 22 to generate `dist/`; App Service executes Flask with Python.

## GitHub configuration

Create repository variables `AZURE_WEBAPP_NAME`, `PUBLIC_TURNSTILE_SITE_KEY` and `ASSET_BASE_URL`, plus the secret `AZURE_WEBAPP_PUBLISH_PROFILE`. The production workflow builds, validates, packages dependencies and deploys only from `main`.

## Application settings

Copy the names from `.env.example` into App Service Configuration. Store SMTP and Turnstile secrets as Key Vault references. Set `APP_TRUSTED_HOSTS` to the production hostname and the default `*.azurewebsites.net` hostname while validation is in progress.

`PUBLIC_TURNSTILE_SITE_KEY` is consumed during the Astro build. `TURNSTILE_SECRET_KEY` remains runtime-only. Configure both together.

## Network

MasterBase SMTP uses TCP 587. If MasterBase requires IP allowlisting, use regional VNet integration plus a NAT Gateway and fixed public IP. This is not required for HTTP delivery, but it is required when the SMTP provider restricts source addresses.

## Security boundary

The Flask endpoint validates payload size, origin, field lengths, email format, honeypot, rate limit and optional Turnstile token. The in-memory limiter assumes one Gunicorn worker; for horizontal scaling, replace it with Redis or enforce the limit at Front Door/WAF.
