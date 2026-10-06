# Architecture

## Runtime model

Astro generates the complete bilingual website as static HTML in `dist/`. Flask does not render pages: it serves those files and owns only operational endpoints such as `/health` and `/api/contact`.

This separation keeps corporate pages crawlable and fast while allowing the email credentials to remain server-side.

## Source responsibilities

- `src/data/site.ts`: typed copy, labels, paths and media references.
- `src/data/routes.ts`: canonical inventory for all generated routes.
- `src/layouts/BaseLayout.astro`: metadata, schema, global navigation and scripts.
- `src/components/`: reusable presentational components.
- `src/components/pages/`: one component for each intentional page family.
- `src/scripts/site.ts`: progressive enhancement for motion, menus and forms.
- `app.py`: security headers, validation, Turnstile verification and MasterBase SMTP.
- `tests/`: static-output and backend regression checks.

## Rendering decisions

Static generation is the default. No component uses `client:*` because the current interactions do not require React state or a hydrated UI tree. A future framework component should use the narrowest directive possible, normally `client:visible` or `client:idle`, and explain why hydration is required.

## Content rules

Every page must have a unique `metaTitle`, `metaDescription`, canonical path and translated counterpart. Add new page families to `PageKey`, `pageOrder`, locale paths, navigation labels and `PageRenderer.astro`. The build fails when route output or required metadata is incomplete.

## Asset migration

Media temporarily resolves through `ASSET_BASE_URL`. After the inventory is approved, files can move to Azure Blob Storage without rewriting components; only the build-time base URL changes.
