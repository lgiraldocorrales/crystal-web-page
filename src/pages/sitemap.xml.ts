import type { APIRoute } from "astro";
import { routes } from "@/data/routes";

export const GET: APIRoute = ({ site }) => {
  const items = routes.map(({ pathname }) => `  <url><loc>${new URL(pathname, site)}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
