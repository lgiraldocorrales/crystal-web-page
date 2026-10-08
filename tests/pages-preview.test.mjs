import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { preparePages, previewRewriter } from "../scripts/pages-preview.mjs";

const options = { base: "/crystal-web-page", origin: "https://lgiraldocorrales.github.io" };

test("preview prefixes navigation, assets and canonical URLs once", () => {
  const rewrite = previewRewriter(options);
  const input = '<a href="/">Home</a><a href="/compania/">Company</a><img srcset="/a.png 1x, /b.png 2x"><link href="https://lgiraldocorrales.github.io/en/"><a href="https://example.com/path">External</a>';
  const output = rewrite(input);
  assert.match(output, /href="\/crystal-web-page\/"/);
  assert.match(output, /href="\/crystal-web-page\/compania\/"/);
  assert.match(output, /\/crystal-web-page\/b\.png/);
  assert.match(output, /https:\/\/lgiraldocorrales\.github\.io\/crystal-web-page\/en\//);
  assert.match(output, /https:\/\/example\.com\/path/);
  assert.doesNotMatch(output, /crystal-web-page\/crystal-web-page/);
});

test("preview package adds markers, blocks indexing and keeps the artifact static", async () => {
  const directory = await mkdtemp(join(tmpdir(), "crystal-pages-"));
  try {
    await mkdir(join(directory, "assets"));
    await writeFile(join(directory, "index.html"), '<html><head></head><body><a href="/">Home</a></body></html>');
    await writeFile(join(directory, "site.webmanifest"), '{"start_url":"/","icons":[{"src":"/favicon.svg"}]}');
    await preparePages(directory, options);
    assert.match(await readFile(join(directory, "index.html"), "utf8"), /crystal-preview/);
    assert.match(await readFile(join(directory, "site.webmanifest"), "utf8"), /crystal-web-page/);
    assert.match(await readFile(join(directory, "robots.txt"), "utf8"), /Disallow: \//);
    await access(join(directory, ".nojekyll"));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("preview rejects invalid deployment configuration", () => {
  assert.throws(() => previewRewriter({ ...options, base: "../bad" }));
  assert.throws(() => previewRewriter({ ...options, origin: "http://example.com" }));
});
