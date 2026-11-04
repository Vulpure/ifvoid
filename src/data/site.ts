import type { Language } from './content';
export const origin = 'https://ifvoid.cn';
export const platforms: { id: string; label: Record<Language, string>; url: string | null }[] = [
  { id: 'github', label: { zh: 'GitHub', en: 'GitHub' }, url: null },
  { id: 'wechat', label: { zh: '微信公众号', en: 'WeChat' }, url: null },
  { id: 'zhihu', label: { zh: '知乎', en: 'Zhihu' }, url: null },
  { id: 'bilibili', label: { zh: '哔哩哔哩', en: 'Bilibili' }, url: null },
];
export function platformUrl(value: string | null): string | null {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
export const homePath = (lang: Language) => lang === 'zh' ? '/' : '/en/';
export const servicePath = (lang: Language, slug: string) => `${homePath(lang)}services/${slug}/`;
export const labels = {
  zh: {
    services: '服务', about: '关于若虚', contact: '联系', switch: 'EN', switchLabel: 'Switch to English',
    all: '全部服务', explore: '了解服务', details: '查看详情', email: '邮件联系', copy: '复制邮箱', copied: '已复制', copyFail: '请手动复制邮箱',
    contactTitle: '从一个具体的需求开始。', contactDesc: '关于技术、应用或内容的想法，欢迎通过邮件与我们交流。',
    serviceScope: '服务内容', other: '其他服务', footer: '人工智能服务集成商', skip: '跳到正文', social: '平台入口', langName: '简体中文',
  },
  en: {
    services: 'Services', about: 'About', contact: 'Contact', switch: '中文', switchLabel: '切换到中文',
    all: 'All services', explore: 'Explore services', details: 'Explore', email: 'Get in touch', copy: 'Copy email', copied: 'Copied', copyFail: 'Please copy the address manually',
    contactTitle: 'Start with a real need.', contactDesc: 'Have a question about technology, an application, or a creative project? Let’s talk by email.',
    serviceScope: 'Our services', other: 'Explore other services', footer: 'AI services integrator', skip: 'Skip to content', social: 'Find us', langName: 'English',
  },
};
