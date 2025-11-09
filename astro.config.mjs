import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://avinashbhat.github.io',
  base: '/',

  // Equivalent to Jekyll's permalink: pretty
  build: {
    format: 'directory'
  },

  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  },

  integrations: [
    sitemap(),
    compress({
      CSS: true,
      HTML: true,
      Image: false,
      JavaScript: true,
      SVG: false
    })
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // SCSS support
        }
      }
    }
  }
});
