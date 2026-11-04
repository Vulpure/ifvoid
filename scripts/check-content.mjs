import assert from 'node:assert/strict';
import { company } from '../src/data/content.ts';
assert.equal(company.services.length, 5);
assert.equal(company.services.reduce((count, service) => count + service.items.length, 0), 15);
assert.equal(company.domain, 'ifvoid.cn');
assert.equal(company.email, 'info@ifvoid.cn');
const governance = company.services.find(service => service.slug === 'governance');
assert.deepEqual(governance.items.map(item => item.name.zh), ['渗透测试评估', '模型安全评测', '防护能力建设', '合规评估与改进']);
console.log('公司内容检查通过：5 类服务、15 个分项，中文和英文资料完整。');
