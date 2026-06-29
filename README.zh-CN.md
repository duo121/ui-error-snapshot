# ui-error-snapshot

<!-- Hero 头图：用 GPT Image 2 生成后保存为 docs/assets/hero.png，再取消下行注释 -->
<!-- ![ui-error-snapshot — Dev 红屏错误自动写入本地，AI Agent 无需截图即可读取](./docs/assets/hero.png) -->

> 把 Dev 红屏错误写入本地文件，让 AI Agent 直接读取 —— 无需截图。

开发时页面一旦 uncaught 报错，Agent 往往只能靠截图或过时日志猜。**ui-error-snapshot** 在 dev 环境捕获未处理错误，写入**单一本地文件**并遵循稳定合同。任何 Agent 循环（Cursor、Codex CLI、Claude Code、OpenCode、CI）在声称「完成」前可运行 `check` 验收。

**English:** [README.md](./README.md)

---

## 用户怎么用？复制这一句话给 AI

**不用 clone 本仓库，不用懂 npm。** 复制下面整段，粘贴给 Cursor / Codex / Claude Code / 任意 Agent：

> 请打开并完整遵循 https://github.com/duo121/ui-error-snapshot/blob/main/docs/复制给Agent.zh-CN.md ，把 ui-error-snapshot 集成到当前项目：dev 环境 uncaught 红屏自动写入 `~/.ui-error-snapshot/ui-error-snapshot.txt`，方便你以后用 CLI 验收；不要 clone ui-error-snapshot 仓库，不要启动额外进程；完成后跑 probe 和 check 验收并告诉我改了哪些文件。

Agent 会自动：`npm install` 依赖 → 改入口 hook → 加 `check` 脚本 → 写 Agent 规则。

完整提示词（给 Agent 读）：[docs/复制给Agent.zh-CN.md](./docs/复制给Agent.zh-CN.md) · [docs/COPY_FOR_AGENT.en.md](./docs/COPY_FOR_AGENT.en.md)

---

## 一眼看懂：它解决什么痛点？

| 以前 | 有了 ui-error-snapshot |
|------|----------------------|
| Dev 红屏 → 你只能截图或口述给 Agent | 错误**自动写入** `~/.ui-error-snapshot/ui-error-snapshot.txt` |
| Agent 靠猜、靠过时日志 | Agent 跑 `check`，**直接读 stack** |
| 每次都要人工介入 | 集成一次，**所有 Agent 循环**都能验收 |

### ① Dev 红屏发生（Electron / RN Web / Vite …）

![Dev 红屏报错示例：Uncaught Error，含源码行号与 Call Stack](./docs/assets/demo-red-screen.png)

### ② Agent 用 CLI 读取同一错误（无需截图）

hook 把红屏内容写入本地文件后，任何 Agent 循环只需：

```bash
npx @duo121/ui-error-snapshot-cli check   # 有错误 → exit 1 + 打印 stack
```

![CLI check 输出：Agent 直接读到 RangeError 与完整 stack trace](./docs/assets/demo-cli-check.png)

> 上图来自 [Agnx](https://github.com/getagnx/agnx) 真实 dev 场景。你的项目集成后流程相同。

**Hero 头图提示词（GPT Image 2）：** [docs/HERO_IMAGE_PROMPT.zh-CN.md](./docs/HERO_IMAGE_PROMPT.zh-CN.md)

---

## 需要额外启动一个项目吗？

**不需要。** 没有守护进程、没有第二套 dev server、也没有需要在后台常驻的服务。

| 方式 | 对用户项目的改动 | 适用场景 |
|------|-----------------|----------|
| **A. devDependency（默认）** | 入口约 5 行、1 个 npm script、1 段 Agent 规则 | 基于 npm 的前端项目 |
| **B. 单文件脚本** | 复制 `scripts/standalone-browser.mjs`，无需 npm 包 | 极简 / 不想新增依赖 |
| **C. 仅 Agent 规则** | 若已有 crash 文件机制则零代码 | 只统一合同 |

**不推荐：** 把本仓库 clone 进用户项目，或把 ui-error-snapshot 当作独立服务运行。

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
git clone https://github.com/duo121/ui-error-snapshot.git
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

**npm 发布：** [docs/PUBLISHING.zh-CN.md](./docs/PUBLISHING.zh-CN.md) · [docs/PUBLISHING.md](./docs/PUBLISHING.md)

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
