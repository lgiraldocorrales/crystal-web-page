import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const routes = [
  "index.html", "compania/index.html", "proposito/index.html", "modelo-de-negocio/index.html",
  "marcas/index.html", "ubicaciones/index.html", "sostenibilidad/index.html", "cumplimiento/index.html", "contacto/index.html",
  "en/index.html", "en/company/index.html", "en/purpose/index.html", "en/business-model/index.html",
  "en/brands/index.html", "en/locations/index.html", "en/sustainability/index.html", "en/compliance/index.html", "en/contact/index.html"
];

for (const route of routes) {
  const html = await readFile(new URL(`../dist/${route}`, import.meta.url), "utf8");
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: expected one H1`);
  assert.match(html, /rel="canonical"/, `${route}: canonical missing`);
  assert.match(html, /hreflang="x-default"/, `${route}: hreflang missing`);
  assert.match(html, /name="description"/, `${route}: description missing`);
  assert.match(html, /"@type":"Organization"/, `${route}: organization schema missing`);
  assert.match(html, /data-theme-toggle/, `${route}: theme toggle missing`);
}

const home = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
assert.match(home, /loader-emblem__shape/, "authentic Crystal mark missing");
assert.match(home, /loader-stitch__needle/, "loader needle missing");
assert.doesNotMatch(home, /class="loader-word"[^>]*>\s*<span[^>]*>C</, "loader duplicates the C mark");

const sitemap = await readFile(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
assert.equal((sitemap.match(/<url>/g) || []).length, routes.length, "sitemap route count mismatch");
await stat(new URL("../dist/favicon.svg", import.meta.url));
await stat(new URL("../dist/site.webmanifest", import.meta.url));

console.log(`Build QA: ${routes.length} routes and core assets passed`);
