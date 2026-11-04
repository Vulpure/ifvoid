import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://ifvoid.cn',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
