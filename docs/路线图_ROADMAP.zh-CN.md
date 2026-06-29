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
| Phase 1 — 核心能力 + npm | ✅ 已发布 | ~95%（CLI bin 补丁待发 0.1.1） |
| Phase 1.5 — 文档与开箱体验 | ✅ 基本完成 | ~90%（可运行 example 待补） |
| Phase 2 — MCP Server | ⏳ 未开始 | 0% |
| Phase 3 — IDE 适配器 | 🔶 骨架已有 | ~30% |
| Phase 4 — 高级能力 | 📋 规划中 | 0% |

---

## Phase 1 — 核心包 + CLI + npm ✅

**目标：** 最小可用链路：浏览器 hook → 文件 sink → CLI 验收。

### 已交付

| 交付物 | npm 包 | 说明 |
|--------|--------|------|
| 核心合同 | `@duo121/ui-error-snapshot-core@0.1.0` | 格式化、路径、`UI_ERROR_SNAPSHOT_PROBE` |
| 文件 sink | `@duo121/ui-error-snapshot-sink-file@0.1.0` | 覆盖写 `~/.ui-error-snapshot/ui-error-snapshot.txt` |
| 浏览器 hook | `@duo121/ui-error-snapshot-hook-browser@0.1.0` | `window.error` / `unhandledrejection` / 可选 RN ErrorUtils |
| CLI | `@duo121/ui-error-snapshot-cli@0.1.0` | `check` · `probe` · `path` · `clear` |
| 零依赖脚本 | `scripts/standalone-browser.mjs` | 不装 npm 包时的 fallback |
| 测试 | vitest | core / sink-file 单测 |
| CI | `.github/workflows/ci.yml` | build + test |

### 待收尾（Phase 1 尾巴）

- [ ] **发布 CLI `0.1.1`** — 修复 `bin` 字段，确保 `npx @duo121/ui-error-snapshot-cli` 可直接执行
- [ ] **统一源码包名** — `packages/cli` 仍标 `@ui-error-snapshot/cli`，与已发布 `@duo121/*` 对齐
- [ ] **GitHub Actions 自动发布** — 配置 `NPM_TOKEN` secret，tag 触发 `publish.yml`

**验收：** 用户在陌生 Vite 项目复制 [复制给Agent.zh-CN.md](./复制给Agent.zh-CN.md) 后，5 分钟内 probe + check 通过。

---

## Phase 1.5 — 文档与开箱体验 ✅（进行中）

**目标：** GitHub 首页 30 秒看懂价值，复制一句话即可集成。

### 已交付

- [x] 中英文 README + Hero 头图 + 红屏/CLI 演示图
- [x] [复制给Agent.zh-CN.md](./复制给Agent.zh-CN.md) — 用户一键复制给 Agent
- [x] [INTEGRATION_PROMPT.zh-CN.md](./INTEGRATION_PROMPT.zh-CN.md) — Agent 完整集成规范
- [x] [HERO_IMAGE_PROMPT.zh-CN.md](./HERO_IMAGE_PROMPT.zh-CN.md)
- [x] [PUBLISHING.zh-CN.md](./PUBLISHING.zh-CN.md)

### 待交付

- [ ] **可运行 example** — `examples/vite-react` 从 sketch 升级为 `npm install && npm run dev` 可演示红屏 + check
- [ ] **适配器 scope 统一** — `adapters/*` 中 `@ui-error-snapshot/cli` 改为 `@duo121/ui-error-snapshot-cli`

---

## Phase 2 — MCP Server ⏳

**目标：** Agent 通过 MCP 工具直接读/清快照，无需 shell `check`（CLI 仍保留作 CI / 无 MCP 场景）。

### 计划包

`@duo121/ui-error-snapshot-mcp`（stdio MCP，Node ≥20）

### 工具合同

| 工具 | 行为 | 返回值 |
|------|------|--------|
| `ui_error_snapshot_read` | 读当前快照文件 | 有内容 → 全文 + `hasError: true`；空 → `hasError: false` |
| `ui_error_snapshot_clear` | 清空快照（dev 重启语义） | `{ ok: true }` |
| `ui_error_snapshot_probe` | 写入探针标记 | `{ ok: true, path }` |
| `ui_error_snapshot_path` | 返回解析后的绝对路径 | `{ path }` |

### 配置

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

### 子任务

1. [ ] `packages/mcp` 脚手架 + 复用 core/sink-file
2. [ ] 实现 4 个 tool handler + schema
3. [ ] vitest 集成测试（临时文件 + mock stdio）
4. [ ] Cursor / Claude Desktop 配置文档
5. [ ] 更新 `adapters/claude-code/CLAUDE.md` 指向 MCP
6. [ ] npm 发布 + README 架构图 MCP 列改为 ✅

**验收：** Cursor 配好 MCP 后，dev 红屏 → Agent 调用 `ui_error_snapshot_read` 拿到与 CLI `check` 相同的 stack。

---

## Phase 3 — IDE 适配器 🔶

**目标：** 各 Agent 环境「复制即用」规则 + 可选原生集成。

| 环境 | 现状 | Phase 3 交付 |
|------|------|--------------|
| **Cursor** | [adapters/cursor/RULE.md](../adapters/cursor/RULE.md) 片段 | 完整 `.mdc` 模板 + MCP 优先说明 |
| **Codex CLI** | [adapters/codex/AGENTS.md](../adapters/codex/AGENTS.md) | 与 MCP / CLI 双路径 |
| **Claude Code** | [adapters/claude-code/CLAUDE.md](../adapters/claude-code/CLAUDE.md) | MCP 工具名对齐 |
| **OpenCode** | [adapters/opencode/README.md](../adapters/opencode/README.md) 调研笔记 | 扩展或 rules 方案（待确认 API） |
| **CI** | 文档提及 | GitHub Actions job 示例：`npm run check:ui-error-snapshot` gate |

### 子任务

- [ ] 各 adapter 统一 `@duo121/*` 安装命令
- [ ] 提供「集成后 Agent 必须遵守」的最小规则块（≤15 行）
- [ ] OpenCode 可行性结论（扩展 vs 纯 AGENTS.md）

---

## Phase 4 — 高级能力 📋

**可选，按需求排期。**

| 能力 | 说明 | 优先级 |
|------|------|--------|
| **watch 模式** | `ui-error-snapshot-cli watch` 阻塞直到有新错误 | 低 |
| **多 workspace** | `UI_ERROR_HOME` 或 `UI_ERROR_SNAPSHOT_ID` 分文件 | 中 |
| **Electron 专用包** | preload IPC 模板（主进程写文件） | 中 |
| **Expo / RN** | ErrorUtils 安全探测文档 + 示例 | 中 |
| **结构化 JSON sink** | 除纯文本外可选 JSON（message + stack + url） | 低 |
| **VS Code 扩展** | 状态栏显示最近快照 | 低 |

---

## 建议执行顺序

```text
1. Phase 1 尾巴（CLI 0.1.1 + 包名统一）     ← 最快收益
2. Phase 1.5 example 可运行
3. Phase 2 MCP（用户最大差异化）
4. Phase 3 适配器打磨
5. Phase 4 按需
```

---

## 如何参与

1. 在 [Issues](https://github.com/duo121/ui-error-snapshot/issues) 认领 Phase 子任务
2. PR 需含：测试、README/路线图状态更新
3. **禁止**对开发目录使用 `rm -rf` 清整仓 — 用 `npm run clean` / `rebuild`

---

## 变更日志（路线图）

| 日期 | 变更 |
|------|------|
| 2026-06-29 | 初版：拆分 Phase 1.5、细化 Phase 2 MCP 合同、补 Phase 1 尾巴 |
| 2026-06-29 | Phase 1 npm `@duo121/*` 发布；README 视觉文档完成 |
