# Publishing guide

## One-time setup

1. Create an npm account at [npmjs.com](https://www.npmjs.com/).
2. Add GitHub Actions secret **`NPM_TOKEN`** (Automation token with publish access).

## Verify locally

```bash
npm ci && npm run build && npm test
npm publish -ws --access public --dry-run
```

## Publish via GitHub Actions

- **Manual:** Actions → **Publish npm** → Run workflow (use `dry_run` first).
- **Release:** Create a GitHub Release tag (e.g. `v0.1.0`) to trigger publish.

## After publish

```bash
npm install -D @duo121/ui-error-snapshot-hook-browser @duo121/ui-error-snapshot-sink-file @duo121/ui-error-snapshot-cli
```

**中文：** [PUBLISHING.zh-CN.md](./PUBLISHING.zh-CN.md)
