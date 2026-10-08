# Temporary GitHub Pages preview

GitHub Pages must compile this repository with Astro, not Jekyll. The workflow in `.github/workflows/pages.yml` builds `main`, rewrites internal URLs for the `/crystal-web-page/` project path, prevents search indexing and publishes only `dist/`.

In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source once. No `gh-pages` branch is required.

Run `npm run build:pages` to reproduce the artifact locally. Its expected public URL is <https://lgiraldocorrales.github.io/crystal-web-page/>.

GitHub Pages is static: it cannot execute Flask, `/health`, `/api/contact`, SMTP or Turnstile verification. The contact form preserves its layout and explains this limitation instead of submitting. The full backend remains available only in the Azure App Service deployment.
