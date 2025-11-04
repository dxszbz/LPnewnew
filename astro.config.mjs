import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  srcDir: './src',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false
    })
  ],
  experimental: {
    clientPrerender: true
  }
});
