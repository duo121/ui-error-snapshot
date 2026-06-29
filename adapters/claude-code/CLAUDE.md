# Claude Code snippet

追加到项目根 `CLAUDE.md`：

```markdown
## UI error snapshot

When verifying dev UI work:

### MCP (preferred)

If `ui-error-snapshot` MCP is configured, call `ui_error_snapshot_read` before completing UI tasks.
Fix any error in the snapshot before claiming success.

Setup: https://github.com/duo121/ui-error-snapshot/blob/main/docs/MCP_SETUP.md

### CLI (fallback)

```bash
npx @duo121/ui-error-snapshot-cli check
```

Non-zero exit → red-screen error in snapshot file. Read stderr and fix.

```bash
npx @duo121/ui-error-snapshot-cli path
```
```
