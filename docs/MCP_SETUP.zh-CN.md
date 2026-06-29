# MCP 配置指南

`@duo121/ui-error-snapshot-mcp` 提供 stdio MCP，让 Agent 直接读/清 dev 红屏快照，无需 shell `check`。

## 工具

| 工具 | 作用 |
|------|------|
| `ui_error_snapshot_read` | 读取快照；有内容时 `hasError: true` |
| `ui_error_snapshot_clear` | 清空快照（dev 重启语义） |
| `ui_error_snapshot_probe` | 写入探针标记，验证链路 |
| `ui_error_snapshot_path` | 返回绝对路径 |

## Cursor

`.cursor/mcp.json` 或 Cursor Settings → MCP（推荐 **0.1.3+**，含 bin 包装器）：

```json
{
  "mcpServers": {
    "ui-error-snapshot": {
      "command": "npx",
      "args": ["-y", "@duo121/ui-error-snapshot-mcp@0.1.3"]
    }
  }
}
```

> **0.1.2 及更早：** `npx` 在 npm workspace monorepo 内可能报 `command not found`（bin 为 symlink）。请升级到 **0.1.3** 或暂用下方 `node` 路径。

本地开发（仓库内，无需 npx）：

```json
{
  "mcpServers": {
    "ui-error-snapshot": {
      "command": "node",
      "args": ["/absolute/path/to/ui-error-snapshot/packages/mcp/dist/server.js"]
    }
  }
}
```

## Claude Desktop

`claude_desktop_config.json`：

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

## Agent 规则补充

完成 UI 改动后，优先调用 `ui_error_snapshot_read`；若 `hasError` 为 true，先修复再继续。

CLI 仍可用于 CI：`npx @duo121/ui-error-snapshot-cli check`

**English:** [MCP_SETUP.md](./MCP_SETUP.md)
