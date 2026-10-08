import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { preparePages } from "./pages-preview.mjs";

const base = "/crystal-web-page";
const origin = "https://lgiraldocorrales.github.io";

// Explicit arguments keep the temporary build reproducible on Windows and CI
// without changing the canonical Azure build configuration.
execFileSync(
  process.execPath,
  ["node_modules/astro/bin/astro.mjs", "build", "--site", origin, "--base", base],
  { env: { ...process.env, PUBLIC_TURNSTILE_SITE_KEY: "" }, stdio: "inherit" },
);

await preparePages(fileURLToPath(new URL("../dist/", import.meta.url)), { base, origin });
