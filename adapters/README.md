# IDE 适配器索引

复制到用户项目对应位置，让 Agent 自动验收 dev 红屏。

| 环境 | 文件 | 复制到 |
|------|------|--------|
| **Cursor** | [cursor/ui-error-snapshot.mdc](./cursor/ui-error-snapshot.mdc) | `.cursor/rules/ui-error-snapshot.mdc` |
| **Codex / 通用** | [codex/AGENTS.md](./codex/AGENTS.md) | 项目根 `AGENTS.md`（追加章节） |
| **Claude Code** | [claude-code/CLAUDE.md](./claude-code/CLAUDE.md) | 项目根 `CLAUDE.md`（追加章节） |
| **OpenCode** | [opencode/README.md](./opencode/README.md) | 按说明配置 rules / MCP |

## MCP 配置（推荐）

所有支持 MCP 的 IDE 优先配置：

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

详见 [docs/MCP_SETUP.zh-CN.md](../docs/MCP_SETUP.zh-CN.md)

## package.json scripts（可选）

```json
{
  "scripts": {
    "check:ui-error-snapshot": "ui-error-snapshot-cli check",
    "probe:ui-error-snapshot": "ui-error-snapshot-cli probe"
  }
}
```
