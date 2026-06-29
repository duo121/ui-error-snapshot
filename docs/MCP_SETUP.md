# MCP setup

Package: `@duo121/ui-error-snapshot-mcp`

## Tools

| Tool | Purpose |
|------|---------|
| `ui_error_snapshot_read` | Read snapshot; `hasError: true` when non-empty |
| `ui_error_snapshot_clear` | Clear snapshot file |
| `ui_error_snapshot_probe` | Write probe marker |
| `ui_error_snapshot_path` | Resolved absolute path |

## Cursor

```json
{
  "mcpServers": {
    "ui-error-snapshot": {
      "command": "npx",
      "args": ["-y", "@duo121/ui-error-snapshot-mcp"]
    }
  }
}
```

See [MCP_SETUP.zh-CN.md](./MCP_SETUP.zh-CN.md) for Claude Desktop and local dev paths.
