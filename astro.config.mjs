import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.crystal.com.co",
  output: "static",
  build: {
    format: "directory"
  },
  vite: {
    build: {
      cssMinify: "lightningcss"
    }
  }
});
