# 若虚科技官网

Astro 构建的中英文静态官网，目标域名为 https://ifvoid.cn/。提供五类服务、15 个分项、邮件联系和复制邮箱。无需在线 Node.js 服务或数据库。

## 本地使用

使用 Node.js 24 LTS 或满足 package.json 要求的较新版本。依赖版本由 package-lock.json 固定。

```sh
npm ci
npm run dev
```

打开终端显示的本地地址，默认 http://127.0.0.1:4321/。停止服务可在终端按 Ctrl+C。

```sh
npm run check  # 公司资料结构及 Astro/TypeScript 检查
npm run build  # 静态构建及产物完整性检查
npm run preview  # 本地预览已构建的 dist，默认端口 4321
```

当前 Astro 版本会将 preview 作为后台进程启动；查看完可运行 `npm exec astro preview stop` 停止。`npm run dev` 则使用 Ctrl+C 停止。

如机器的默认 npm 缓存目录权限受限，可仅为本次命令指定可写临时缓存，例如 `npm --cache /private/tmp/ifvoid-npm-cache ci`，无需改变用户目录权限。

## 内容与文件维护

- `docs/若虚科技信息.md`：唯一人工维护的公司资料来源，包含中文与英文。构建时只提取基础信息、服务介绍与分项表格；内部说明、参考资料及未确认的成果描述不会发布。
- `docs/官网架构设计.md`：架构、视觉交互规则、发布条件和实际验证结果。
- `src/data/content.ts`：构建时解析资料并检查五类服务名称及 15 个分项。确认新增分项后，同步更新该文件的数量约束和 `scripts/check-content.mjs`。
- `src/data/site.ts`：域名、界面文字与平台配置。平台 `url: null` 时不显示；填入有效 HTTPS 地址后成为可访问入口。
- `src/components/`、`src/layouts/`、`src/styles/`：页面实现。
- `dist/`：重新生成的发布产物；`node_modules/`、`.astro/` 同样不纳入 Git。

首版不展示使命、愿景、价值观、公司全称、客户分类、未确认的成果说明及尚未提供的案例或资质。

## GitHub Pages 与 Cloudflare

当前交付为本地开发成果与部署配置，尚未创建远程仓库、实际运行 GitHub Actions 或绑定域名。

1. 将本目录源码放入选定的 GitHub 仓库，主分支使用 `main`；使用 GitHub Free Pages 时需满足其仓库与用途要求。

   公开仓库中的源码和 docs 也可被访问；“内部参考”表示不在网页正文展示，不是仓库访问权限设置。
2. 在账户或组织中验证自定义域名所有权；在仓库 Settings → Pages 中选择 GitHub Actions，并将自定义域名设置为 `ifvoid.cn`。
3. `.github/workflows/deploy.yml` 在 PR 中执行检查与构建；合并或推送至 main 后上传 dist 并部署到 Pages。工作流不需要个人访问令牌。
4. 按 GitHub 官方自定义域名文档配置 Cloudflare DNS。现有配置面向自定义根域名，不能直接作为 `/仓库名/` 子路径站点使用；尚未绑定域名时使用本地预览，或同步调整站点路径配置。
5. 先检查 GitHub Pages 源站域名与 HTTPS 证书，再启用 Cloudflare 代理及 Full (strict)。统一根域名与 www，验证 HTTP→HTTPS 和重定向没有循环。
6. 静态带指纹资源使用较长缓存；HTML 按较短缓存策略处理，更新后按需清理。Cloudflare 规则由账户侧配置，代码不会自动修改 DNS、邮箱 MX 或缓存规则。
7. 发布后检查中文、英文、五类服务详情、404、站点地图、邮件链接、语言切换及国内实际访问情况。

`public/CNAME` 保留目标域名标记，GitHub Actions 部署时仍需在仓库 Pages 设置中配置自定义域名。`astro.config.mjs` 与 `src/data/site.ts` 的生产地址应保持一致。

GitHub Pages 有商业用途限制；正式上线前按实际用途核对。Cloudflare 免费方案不含中国大陆节点，不能据此保证国内速度。域名续费和邮箱服务独立于静态托管，本项目不包含邮箱开通或收发验证。

## 官方参考

- [Astro 部署至 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Pages 自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages 限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Cloudflare Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)
- [Cloudflare 中国网络](https://developers.cloudflare.com/china-network/)
