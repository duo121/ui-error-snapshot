# Codex / generic agent snippet

追加到项目根 `AGENTS.md`：

```markdown
## Dev UI error snapshot

After frontend, Electron renderer, or RN Web UI changes — **before claiming the task is done**:

### Preferred: MCP (`ui-error-snapshot` server)

1. Call `ui_error_snapshot_read`
2. If `hasError` or stack text is present → fix the crash, then read again until clean
3. Optional pipeline check: `ui_error_snapshot_probe`

MCP config: https://github.com/duo121/ui-error-snapshot/blob/main/docs/MCP_SETUP.md

### Fallback: CLI

```bash
npx @duo121/ui-error-snapshot-cli check
```

- Exit 0: no uncaught dev UI error in `~/.ui-error-snapshot/ui-error-snapshot.txt`
- Exit 1: stderr contains the stack — fix before finishing

### Optional package.json scripts

```json
{
  "scripts": {
    "check:ui-error-snapshot": "ui-error-snapshot-cli check",
    "probe:ui-error-snapshot": "ui-error-snapshot-cli probe"
  }
}
```

### One-line integration for new projects

Ask the agent to follow https://github.com/duo121/ui-error-snapshot/blob/main/docs/COPY_FOR_AGENT.en.md
```
