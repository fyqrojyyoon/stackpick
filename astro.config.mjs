import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://stackpick-89q.pages.dev',
  output: 'static',
  integrations: [sitemap()],
});
