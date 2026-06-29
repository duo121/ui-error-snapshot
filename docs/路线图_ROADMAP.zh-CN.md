# ui-error-snapshot 路线图

> 最后更新：2026-06-29 · 仓库：https://github.com/duo121/ui-error-snapshot

**English:** [ROADMAP.md](./ROADMAP.md)

---

## 总目标

让任意 AI 编程 Agent 在 dev 红屏时**无需截图**，通过稳定本地文件合同 + CLI / MCP 读取错误并验收。

```text
Dev 红屏 → hook 捕获 → ~/.ui-error-snapshot/ui-error-snapshot.txt → Agent check / MCP read
```

---

## 当前进度概览

| 阶段 | 状态 | 完成度 |
|------|------|--------|
| Phase 1 — 核心能力 + npm | ✅ 已发布 | 100% |
| Phase 1.5 — 文档与开箱体验 | ✅ 已完成 | 100% |
| Phase 2 — MCP Server | ✅ 已发布 | 100% |
| Phase 3 — IDE 适配器 | ✅ 已完成 | 95% |
| Phase 4 — 高级能力 | 📋 按需 | 0% |

---

## Phase 1 — 核心包 + CLI + npm ✅

| 交付物 | npm 包 | 版本 |
|--------|--------|------|
| 核心合同 | `@duo121/ui-error-snapshot-core` | 0.1.0 |
| 文件 sink | `@duo121/ui-error-snapshot-sink-file` | 0.1.0 |
| 浏览器 hook | `@duo121/ui-error-snapshot-hook-browser` | 0.1.0 |
| CLI | `@duo121/ui-error-snapshot-cli` | 0.1.1 |
| 零依赖脚本 | `scripts/standalone-browser.mjs` | — |
| CI | `.github/workflows/ci.yml` | — |

**可选后续：** GitHub Actions `NPM_TOKEN` 自动发布（避免每次 OTP）。

---

## Phase 1.5 — 文档与开箱体验 ✅

- [x] 中英文 README + Hero + 演示图
- [x] [复制给Agent.zh-CN.md](./复制给Agent.zh-CN.md) — 用户一键复制
- [x] [INTEGRATION_PROMPT.zh-CN.md](./INTEGRATION_PROMPT.zh-CN.md)
- [x] [examples/vite-react](../examples/vite-react/) 可运行示例
- [x] `@duo121/*` 包名全仓统一

---

## Phase 2 — MCP Server ✅

| 工具 | 状态 |
|------|------|
| `ui_error_snapshot_read` | ✅ |
| `ui_error_snapshot_clear` | ✅ |
| `ui_error_snapshot_probe` | ✅ |
| `ui_error_snapshot_path` | ✅ |

**npm：** `@duo121/ui-error-snapshot-mcp@0.1.3`

**配置：** 见 [MCP_SETUP.zh-CN.md](./MCP_SETUP.zh-CN.md)

> **注意：** 在 ui-error-snapshot 仓库根目录内测 `npx` 可能因 workspace 链接失败；在用户项目或 `/tmp` 下正常。

---

## Phase 3 — IDE 适配器 ✅

| 环境 | 交付物 |
|------|--------|
| Cursor | [adapters/cursor/ui-error-snapshot.mdc](../adapters/cursor/ui-error-snapshot.mdc) |
| Codex | [adapters/codex/AGENTS.md](../adapters/codex/AGENTS.md) |
| Claude Code | [adapters/claude-code/CLAUDE.md](../adapters/claude-code/CLAUDE.md) |
| OpenCode | [adapters/opencode/README.md](../adapters/opencode/README.md)（调研笔记） |
| MCP 文档 | [MCP_SETUP.zh-CN.md](./MCP_SETUP.zh-CN.md) |

**待确认：** OpenCode 原生扩展 API（当前用 AGENTS.md + MCP 双路径）。

---

## Phase 4 — 高级能力 📋

| 能力 | 优先级 |
|------|--------|
| GitHub Actions + `NPM_TOKEN` 免 OTP 发布 | 中 |
| `watch` 模式（阻塞直到有新错误） | 低 |
| 多 workspace 分文件 | 中 |
| Electron 专用 IPC 包 | 中 |
| 结构化 JSON sink | 低 |

---

## 变更日志

| 日期 | 变更 |
|------|------|
| 2026-06-29 | 初版路线图 |
| 2026-06-29 | Phase 1–3 完成；MCP 0.1.3 发布；文档/示例收尾 |
