import { defineConfig } from 'astro/config';
export default defineConfig({
  site: process.env.SITE_ORIGIN || 'https://ifvoid.cn',
  base: process.env.SITE_BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
