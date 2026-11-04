import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type Language = 'zh' | 'en';
export type Translation = Record<Language, string>;
export interface ServiceItem { name: Translation; description: Translation }
export interface Service {
  slug: string; number: string; nav: string; title: Translation; fullName: string;
  introduction: Translation; items: ServiceItem[];
}
export interface Company {
  name: string; email: string; domain: string; overview: Translation; services: Service[];
}

const sourcePath = resolve(process.cwd(), 'docs/若虚科技信息.md');
const definitions = [
  ['compute', '算力服务', 'Compute', 'AI Compute Services', 2],
  ['models', '模型服务', 'Models', 'AI Model Services', 2],
  ['engineering', '应用服务', 'Engineering', 'AI Engineering Services', 3],
  ['creation', '创意服务', 'Creation', 'AI Content Creation Services', 4],
  ['governance', '治理服务', 'Governance', 'AI Governance Services', 4],
] as const;

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(`公司资料检查失败：${message}`);
}
function section(text: string, heading: string, level = 4): string {
  const start = `${'#'.repeat(level)} ${heading}\n`;
  const index = text.indexOf(start);
  assert(index !== -1, `缺少“${heading}”章节`);
  const after = text.slice(index + start.length);
  const next = after.search(new RegExp(`^#{1,${level}} `, 'm'));
  return (next === -1 ? after : after.slice(0, next)).trim();
}
function tableRows(text: string): string[][] {
  const rows = text.split('\n').filter(line => line.startsWith('|'));
  assert(rows.length >= 3, '表格缺少内容');
  return rows.slice(2).map(line => line.slice(1, -1).split('|').map(cell => cell.trim()));
}
export function getCompany(): Company {
  const markdown = readFileSync(sourcePath, 'utf8').replaceAll('\r\n', '\n');
  const basic = new Map(tableRows(section(markdown, '一、基础信息', 2)).map(row => [row[0], row[1]]));
  const name = basic.get('名称');
  const email = basic.get('联系方式')?.replace(/^邮箱联系：/, '');
  const domain = basic.get('官网域名');
  assert(name && email && domain, '名称、邮箱或域名为空');
  assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), '邮箱格式不正确');
  const serviceSource = section(markdown, '二、服务模块', 2);
  const overview = {
    zh: section(serviceSource, '中文总述'),
    en: section(serviceSource, 'English Overview'),
  };
  const headings = [...serviceSource.matchAll(/^### (\d+)\. (.+)｜(.+)$/gm)];
  assert(headings.length === definitions.length, '应有五类服务');
  const services = headings.map((match, index): Service => {
    const [slug, title, nav, fullName, itemCount] = definitions[index];
    assert(match[1] === String(index + 1) && match[2] === title && match[3] === nav, `服务 ${index + 1} 的名称或顺序不符合已确认结构`);
    assert(serviceSource.includes(`| ${title} | ${nav} | ${fullName} |`), `${title} 名称表不一致`);
    const body = serviceSource.slice(match.index! + match[0].length, headings[index + 1]?.index);
    assert(body.includes(`**${fullName}**`), `${title} 的完整英文名称不一致`);
    const paragraphs = section(body, '模块介绍').split(/\n\s*\n/).filter(Boolean);
    assert(paragraphs.length === 2, `${title} 应包含中文和英文介绍各一段`);
    const rows = tableRows(section(body, '分项服务'));
    assert(rows.length === itemCount, `${title} 应有 ${itemCount} 个分项；如确认变更，请同步更新内容检查规则`);
    rows.forEach(row => assert(row.length === 4 && row.every(Boolean), `${title} 分项缺少中英文名称或介绍`));
    const service: Service = {
      slug, number: String(index + 1).padStart(2, '0'), nav,
      title: { zh: title, en: nav }, fullName,
      introduction: { zh: paragraphs[0], en: paragraphs[1] },
      items: rows.map(row => ({ name: { zh: row[0], en: row[1] }, description: { zh: row[2], en: row[3] } })),
    };
    return service;
  });
  return { name, email, domain, overview, services };
}
export const company = getCompany();
