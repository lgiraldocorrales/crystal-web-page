import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targetDirectory = resolve(root, "public/assets/fonts");

await mkdir(targetDirectory, { recursive: true });
await copyFile(
  resolve(root, "node_modules/@fontsource-variable/raleway/files/raleway-latin-ext-wght-normal.woff2"),
  resolve(targetDirectory, "raleway-latin-ext-wght-normal.woff2")
);
