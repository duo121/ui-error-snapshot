# ui-error-snapshot

> 把 Dev 红屏错误写入本地文件，让 AI Agent 直接读取 —— 无需截图。

开发时页面一旦 uncaught 报错，Agent 往往只能靠截图或过时日志猜。**ui-error-snapshot** 在 dev 环境捕获未处理错误，写入**单一本地文件**并遵循稳定合同。任何 Agent 循环（Cursor、Codex CLI、Claude Code、OpenCode、CI）在声称「完成」前可运行 `check` 验收。

源自 [Agnx](https://github.com/getagnx/agnx) 生产实践。

**English:** [README.md](./README.md) · **一键 Agent 提示词：** [INTEGRATION_PROMPT.zh-CN.md](./docs/INTEGRATION_PROMPT.zh-CN.md) · [INTEGRATION_PROMPT.en.md](./docs/INTEGRATION_PROMPT.en.md)

## 需要额外启动一个项目吗？

**不需要。** 没有守护进程、没有第二套 dev server、也没有需要在后台常驻的服务。

| 方式 | 对用户项目的改动 | 适用场景 |
|------|-----------------|----------|
| **A. devDependency（默认）** | 入口约 5 行、1 个 npm script、1 段 Agent 规则 | 基于 npm 的前端项目 |
| **B. 单文件脚本** | 复制 `scripts/standalone-browser.mjs`，无需 npm 包 | 极简 / 不想新增依赖 |
| **C. 仅 Agent 规则** | 若已有 crash 文件机制则零代码 | 只统一合同 |

**不推荐：** 把本仓库 clone 进用户项目，或把 ui-error-snapshot 当作独立服务运行。

**终端用户：** 把集成提示词复制给 Agent —— 见 [docs/INTEGRATION_PROMPT.zh-CN.md](./docs/INTEGRATION_PROMPT.zh-CN.md)。

## 架构

```
┌──────────────────────────────────────────────────────────────┐
│                     Dev Host Application                      │
│  Electron · RN Web · Vite · Next · Expo …                     │
├──────────────────────────────────────────────────────────────┤
│  Hook Layer (@ui-error-snapshot/hook-browser)                 │
│  ├─ window.error / unhandledrejection                           │
│  ├─ ErrorUtils.setGlobalHandler (RN, optional)                  │
│  └─ window.__uiErrorSnapshotProbe() (dev verification)          │
└───────────────────────────┬──────────────────────────────────┘
                            │ formatUiError()
                            v
┌──────────────────────────────────────────────────────────────┐
│              @ui-error-snapshot/core                            │
│  normalize · paths · probe marker · dev gate                    │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            v
┌──────────────────────────────────────────────────────────────┐
│              @ui-error-snapshot/sink-file                       │
│  overwrite write → $UI_ERROR_HOME/ui-error-snapshot.txt         │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            v
┌──────────────────────────────────────────────────────────────┐
│                   Agent / IDE Consumption                       │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│ CLI check    │ MCP (Phase 2)│ Cursor rules │ CI gate           │
│ probe · path │ read / clear │ AGENTS.md    │ exit code 1       │
└──────────────┴──────────────┴──────────────┴───────────────────┘
         │              │              │
         v              v              v
    Codex CLI      Claude Code      Cursor Agent
```

### 合同

| 项 | 值 |
|----|-----|
| 默认路径 | `~/.ui-error-snapshot/ui-error-snapshot.txt` |
| 覆盖环境变量 | `UI_ERROR_HOME=/path/to/dir` |
| 写入语义 | 每次 uncaught 错误 **覆盖写** |
| 范围 | **仅 dev**（`NODE_ENV !== production`） |
| 探针标记 | `UI_ERROR_SNAPSHOT_PROBE` |

## 快速开始

```bash
git clone https://github.com/getagnx/ui-error-snapshot.git
cd ui-error-snapshot
npm install
npm run build
npm test

# 用 CLI 验证文件 sink
npm run ui-error-snapshot -- probe
npm run ui-error-snapshot -- check   # 非空则 exit 1
npm run ui-error-snapshot -- path
```

### 浏览器 / Electron 渲染进程

```ts
import { installBrowserErrorSnapshot } from "@ui-error-snapshot/hook-browser";
import { createFileSink } from "@ui-error-snapshot/sink-file";

const sink = createFileSink();

installBrowserErrorSnapshot({
  enabled: typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production",
  write: (text) => sink.write(text),
  clear: () => sink.clear(),
});
```

Electron 场景下，请把 `write`/`clear` 接到 preload IPC，而不是在渲染进程直接写文件。

### Agent 循环（任意 IDE）

完成 UI 相关改动后，Agent 必须运行：

```bash
npx @ui-error-snapshot/cli check
```

- **Exit 0** — 快照为空 → 未观察到 uncaught UI 错误
- **Exit 1** — stderr 打印 stack → 先修复再结束任务

Cursor、Codex、Claude Code、OpenCode 片段见 [`adapters/`](./adapters/)。

## 包

| 包 | 作用 |
|----|------|
| `@ui-error-snapshot/core` | 格式化、路径、常量 |
| `@ui-error-snapshot/sink-file` | Node 文件 sink（覆盖写） |
| `@ui-error-snapshot/hook-browser` | Window + 可选 RN ErrorUtils hooks |
| `@ui-error-snapshot/cli` | `check` · `probe` · `path` · `clear` |

## 路线图

- [x] Phase 1 — core + file sink + CLI + tests
- [ ] Phase 2 — MCP server（`read_snapshot`、`clear_snapshot`）
- [ ] Phase 3 — 各 IDE 适配器完善 + OpenCode 扩展调研
- [ ] Phase 4 — 可选 watch / 多 workspace 文件名

## License

MIT
