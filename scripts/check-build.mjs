import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { company } from '../src/data/content.ts';
import { platforms, platformUrl } from '../src/data/site.ts';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const paths = ['/', '/en/', ...company.services.flatMap(service => [`/services/${service.slug}/`, `/en/services/${service.slug}/`])];
let links = 0;
const disabledPlatforms = platforms.filter(platform => !platformUrl(platform.url)).length;
for (const path of [...paths, '/404.html']) {
  const file = join(root, path.endsWith('/') ? `${path}index.html` : path);
  assert(existsSync(file), `页面未生成：${path}`);
  const html = readFileSync(file, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path} 应只有一个 h1`);
  if (path !== '/404.html') assert(html.includes('mailto:info@ifvoid.cn'), `${path} 缺少邮件联系入口`);
  assert(!html.includes('href="#"'), `${path} 存在伪链接`);
  assert(!/(内部参考|概念参考|资料用于核对|使命｜|愿景｜|天津若虚科技有限公司|To B|To C)/.test(html), `${path} 泄露非展示内容`);
  assert(!/(交付成果|交付方式|待确认|待补充|链接暂未配置)/.test(html), `${path} 包含未确认或内部维护文案`);
  assert.equal((html.match(/class="platform-disabled"/g) || []).length, 0, `${path} 不应渲染未配置平台`);
  if (disabledPlatforms === platforms.length) assert(!html.includes('class="platforms"'), `${path} 不应展示空的平台区域`);
  if (path !== '/404.html') {
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert(html.includes(`href="https://ifvoid.cn${path}"`));
    assert(html.includes('hreflang="zh-CN"') && html.includes('hreflang="en"'));
    assert(html.includes(`lang="${path.startsWith('/en/') ? 'en' : 'zh-CN'}"`));
  }
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const value = match[1];
    if (!value.startsWith('/')) continue;
    const target = value.split('?')[0];
    assert(existsSync(join(root, target.endsWith('/') ? `${target}index.html` : target)), `${path} 存在无效内部资源：${value}`);
    links++;
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(match[1]);
}
for (const service of company.services) {
  for (const lang of ['zh', 'en']) {
    const prefix = lang === 'en' ? '/en' : '';
    const html = readFileSync(join(root, `${prefix}/services/${service.slug}/index.html`), 'utf8');
    for (const item of service.items) assert(html.includes(item.name[lang].replaceAll('&', '&amp;')), `缺少分项 ${item.name[lang]}`);
  }
}
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
assert.equal((sitemap.match(/<url>/g) || []).length, 12);
assert.equal(readFileSync(join(root, 'CNAME'), 'utf8').trim(), company.domain);
assert(readFileSync(join(root, 'robots.txt'), 'utf8').includes('https://ifvoid.cn/sitemap.xml'));
const files = [];
function walk(directory) { for (const name of readdirSync(directory)) { const path = join(directory, name); statSync(path).isDirectory() ? walk(path) : files.push(path); } }
walk(root);
assert(!files.some(file => /\.(md|ts|astro|map)$/.test(file)));
assert(!files.some(file => /server\.(mjs|js)$/.test(file)));
const bytes = files.reduce((sum, file) => sum + statSync(file).size, 0);
console.log(`静态产物检查通过：12 个内容页、404、${links} 个内部链接/资源引用，合计 ${(bytes / 1024).toFixed(1)} KiB。`);
