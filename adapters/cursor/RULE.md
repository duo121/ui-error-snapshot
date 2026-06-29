# Cursor rule snippet

**推荐：** 直接复制完整规则文件：

→ [ui-error-snapshot.mdc](./ui-error-snapshot.mdc) 到 `.cursor/rules/ui-error-snapshot.mdc`

## MCP（推荐）

在 Cursor MCP 设置中添加 `ui-error-snapshot` server，见 [docs/MCP_SETUP.zh-CN.md](../../docs/MCP_SETUP.zh-CN.md)。

Agent 完成 UI 改动后调用 `ui_error_snapshot_read`，有错误则修复后再继续。

## CLI 备选

```bash
npx @duo121/ui-error-snapshot-cli check
```
