# Agent 集成任务：ui-error-snapshot（最小侵入）

你是 coding agent。请把 **ui-error-snapshot** 集成到**当前用户项目**，让 dev 环境下 uncaught UI 错误自动写入本地文件，便于你后续用 CLI 读取验收。

## 目标

- 用户**不需要** clone ui-error-snapshot 仓库、**不需要**启动额外进程/守护进程。
- 对业务代码侵入：**入口文件约 5 行** + **package.json 一个 script** + **Agent 规则一段**。
- 完成后你能运行 `npm run check:ui-error-snapshot`（或 `npx @duo121/ui-error-snapshot-cli check`），exit 1 表示有红屏级错误。

## 合同（必须遵守）

- 文件路径：`$UI_ERROR_HOME/ui-error-snapshot.txt`，默认 `~/.ui-error-snapshot/ui-error-snapshot.txt`
- 写入语义：**覆盖写**，仅 uncaught 错误，**仅 dev**
- 探针常量：`UI_ERROR_SNAPSHOT_PROBE`

## 第一步：检测技术栈

按优先级判断：

1. **Electron 桌面**（有 main/preload/renderer 分离）→ 渲染进程 hook + 主进程写文件 IPC（参考 Agnx 模式）
2. **Vite / Webpack / Next / CRA** → 浏览器 hook + Node 文件 sink 或纯浏览器写不了文件时用 IPC/后端 endpoint
3. **Expo / RN Web** → hook-browser + 注意 ErrorUtils 可能为 undefined，必须安全探测
4. **纯 Node CLI 无 UI** → **跳过**，告知用户不适用

## 第二步：选集成模式（默认 A）

### 模式 A — npm devDependency（推荐）

```bash
npm install -D @duo121/ui-error-snapshot-hook-browser @duo121/ui-error-snapshot-sink-file @duo121/ui-error-snapshot-cli
```

在 **dev 入口最早执行处**（如 `main.tsx` / `_layout.tsx` / `index.js`）：

```ts
if (import.meta.env?.DEV ?? process.env.NODE_ENV !== "production") {
  const { createFileSink } = await import("@duo121/ui-error-snapshot-sink-file");
  const { installBrowserErrorSnapshot } = await import("@duo121/ui-error-snapshot-hook-browser");
  const sink = createFileSink();
  installBrowserErrorSnapshot({
    enabled: true,
    write: (t) => sink.write(t),
    clear: () => sink.clear(),
  });
}
```

`package.json` scripts：

```json
{
  "scripts": {
    "check:ui-error-snapshot": "ui-error-snapshot check",
    "probe:ui-error-snapshot": "ui-error-snapshot probe"
  }
}
```

### 模式 B — 单文件零依赖（用户拒绝加 npm 时）

从 ui-error-snapshot 仓库复制 `scripts/standalone-browser.mjs` 到用户项目 `scripts/`，入口动态 import，不添加 npm 依赖。CLI check 用同目录下的 standalone check 逻辑或内联 20 行 readFile。

### 模式 C — 仅 Agent 规则（已有 crash 文件）

若项目已有类似机制，只统一路径与 check script，不重复 hook。

## 第三步：Agent 规则

根据 IDE 添加一段（二选一或多选）：

- **Cursor**：`.cursor/rules/ui-error-snapshot.mdc` — 任务结束前必须 `npm run check:ui-error-snapshot`
- **Codex / 通用**：`AGENTS.md` 同上
- **Claude Code**：`CLAUDE.md` 同上

模板见：https://github.com/duo121/ui-error-snapshot/tree/main/adapters

## 第四步：验收

1. `npm run probe:ui-error-snapshot` → 文件含 `UI_ERROR_SNAPSHOT_PROBE`
2. `npm run check:ui-error-snapshot` → exit 1 且 stderr 有 stack
3. 重启 dev app → 文件被清空 → check exit 0
4. 向用户汇报：改动文件列表、快照路径、如何手动 probe

## 禁止

- ❌ 要求用户 clone ui-error-snapshot 到项目内
- ❌ 启动独立 daemon / 第二 dev server
- ❌ 在生产环境写入
- ❌ 改动超过必要范围（不要 refactor 无关代码）

## 参考

- 仓库：https://github.com/duo121/ui-error-snapshot
- npm 包：`@duo121/ui-error-snapshot-*`

**English:** [INTEGRATION_PROMPT.en.md](./INTEGRATION_PROMPT.en.md)
