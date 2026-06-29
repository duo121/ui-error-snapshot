# 发布指南

## 一次性准备

1. 在 [npmjs.com](https://www.npmjs.com/) 注册账号（个人 scope 为 `@duo121`，无需单独创建 org）。
2. 在 GitHub 仓库 **Settings → Secrets → Actions** 添加：
   - `NPM_TOKEN` — npm Access Token（Automation 类型，Publish 权限）

## 本地验证（发布前）

```bash
npm ci
npm run build
npm test
npm publish -ws --access public --dry-run
```

## 通过 GitHub Actions 发布

**方式 A — 手动触发（推荐首次）**

1. GitHub → Actions → **Publish npm** → Run workflow
2. 首次可勾选 `dry_run` 验证
3. 确认无误后再次 Run workflow（不勾选 dry_run）

**方式 B — GitHub Release**

创建 Release tag（如 `v0.1.0`）会自动触发 publish workflow。

## 发布顺序

npm workspaces 按依赖顺序发布：

1. `@duo121/ui-error-snapshot-core`
2. `@duo121/ui-error-snapshot-sink-file` · `@duo121/ui-error-snapshot-hook-browser`
3. `@duo121/ui-error-snapshot-cli` · `@duo121/ui-error-snapshot-mcp`

## 用户安装（发布后）

```bash
npm install -D @duo121/ui-error-snapshot-hook-browser @duo121/ui-error-snapshot-sink-file @duo121/ui-error-snapshot-cli
```
