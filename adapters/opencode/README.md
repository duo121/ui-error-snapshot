# OpenCode adapter

## 现状（2026-06）

OpenCode 的扩展 / MCP 入口因版本而异。推荐路径：

1. **应用内 hook** — 与 Codex 相同，在 dev 入口安装 `@duo121/ui-error-snapshot-hook-browser` + sink
2. **Agent 规则** — 将 [codex/AGENTS.md](../codex/AGENTS.md) 章节并入 OpenCode 项目说明
3. **MCP** — 若你的 OpenCode 版本支持 stdio MCP，配置：

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

4. **Shell 验收** — 任务结束前：`npx @duo121/ui-error-snapshot-cli check`

## 待确认

- [ ] OpenCode 官方 MCP 配置文件路径与 schema
- [ ] 是否有 first-party 扩展 API 可自动注入 rules

欢迎 PR 补充版本特定的配置截图与路径。

## 相关文档

- [MCP 配置](../../docs/MCP_SETUP.zh-CN.md)
- [一键集成](../../docs/复制给Agent.zh-CN.md)
