# 若虚科技官网

更新日期：2026-11-04

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

## GitHub Pages 与阿里云 DNS

公开源码仓库：[Vulpure/ifvoid](https://github.com/Vulpure/ifvoid)。GitHub Pages 使用 GitHub Actions 自动检查、构建和部署，官网使用 https://ifvoid.cn/ ，阿里云免费 DNS 直接解析到 GitHub Pages。2026-11-04 用户确认不使用 Cloudflare，无需迁移名称服务器或接入额外 CDN。

工作流通过 `actions/configure-pages` 读取实际发布地址，以 `SITE_ORIGIN` 和 `SITE_BASE_PATH` 传入构建，页面链接、资源、语言切换、404、canonical 和站点地图均随地址调整。本地构建默认使用 ifvoid.cn 根路径；更改 Pages 域名或 HTTPS 设置后，重新运行工作流以更新生产地址。原 GitHub 默认地址会由 Pages 重定向到自定义域名。

1. 将本目录源码放入选定的 GitHub 仓库，主分支使用 `main`；使用 GitHub Free Pages 时需满足其仓库与用途要求。

   公开仓库中的源码和 docs 也可被访问；“内部参考”表示不在网页正文展示，不是仓库访问权限设置。
2. 在账户或组织中验证自定义域名所有权；在仓库 Settings → Pages 中选择 GitHub Actions，并将自定义域名设置为 `ifvoid.cn`。
3. `.github/workflows/deploy.yml` 在 PR 中执行检查与构建；合并或推送至 main 后上传 dist 并部署到 Pages。工作流不需要个人访问令牌。
4. 阿里云 DNS 的 `@` 添加四条 A 记录：`185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`；`www` 添加 CNAME 指向 `vulpure.github.io`。当前 TTL 均为 10 分钟。保留 `_github-pages-challenge-vulpure` TXT 记录，以维持 GitHub 域名验证。
5. 在 GitHub Pages 中等待 DNS 检查和免费证书签发完成，启用 Enforce HTTPS，重新部署后检查 HTTP→HTTPS 及 www→根域名重定向。
6. 页面和静态资源由 GitHub Pages 托管，不需要自建服务器、额外证书服务或 CDN 配置。代码不会自动修改 DNS 或邮箱 MX 等记录。
7. 发布后检查中文、英文、五类服务详情、404、站点地图、邮件链接、语言切换及国内实际访问情况。

`public/CNAME` 保留目标域名标记，GitHub Actions 会忽略该文件，自定义域名必须在仓库 Pages 设置中配置。`astro.config.mjs` 与 `src/data/site.ts` 共用构建环境中的站点地址与路径变量。

GitHub Pages 有商业用途限制，需按实际用途核对。国内实际访问效果取决于当地网络，DNS 直连不能保证访问速度。域名续费和邮箱服务独立于静态托管，本项目不包含邮箱开通或收发验证。

## 官方参考

- [Astro 部署至 GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Pages 自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages 限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub Pages 域名验证](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
