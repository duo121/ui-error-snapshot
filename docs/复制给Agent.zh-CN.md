# ↓↓↓ 复制以下全部内容，粘贴给你的 Agent ↓↓↓

请把 **ui-error-snapshot** 集成到当前项目，解决你以后读取 dev 页面红屏报错的问题。按下面规范执行，不要 clone 仓库，不要启动额外进程。

---

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

1. **Electron 桌面**（有 main/preload/renderer 分离）→ 渲染进程 hook + 主进程写文件 IPC
2. **Vite / Webpack / Next / CRA** → 浏览器 hook + Node 文件 sink
3. **Expo / RN Web** → hook-browser；ErrorUtils 可能为 undefined，必须安全探测
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
    "check:ui-error-snapshot": "ui-error-snapshot-cli check",
    "probe:ui-error-snapshot": "ui-error-snapshot-cli probe"
  }
}
```

若 `ui-error-snapshot-cli` 不可用，改用 `npx @duo121/ui-error-snapshot-cli check`。

### 模式 B — 单文件零依赖（用户拒绝加 npm 时）

从 https://github.com/duo121/ui-error-snapshot/blob/main/scripts/standalone-browser.mjs 复制到用户项目 `scripts/`。

### 模式 C — 仅 Agent 规则（已有 crash 文件）

只统一路径与 check script，不重复 hook。

## 第三步：Agent 规则

- **Cursor**：`.cursor/rules/ui-error-snapshot.mdc`
- **Codex / 通用**：`AGENTS.md`
- **Claude Code**：`CLAUDE.md`

模板：https://github.com/duo121/ui-error-snapshot/tree/main/adapters

## 第四步：验收

1. `npm run probe:ui-error-snapshot` → 文件含 `UI_ERROR_SNAPSHOT_PROBE`
2. `npm run check:ui-error-snapshot` → exit 1 且 stderr 有 stack
3. 重启 dev app → 文件被清空 → check exit 0
4. 向用户汇报：改动文件列表、快照路径

## 禁止

- ❌ 要求用户 clone ui-error-snapshot 到项目内
- ❌ 启动独立 daemon / 第二 dev server
- ❌ 在生产环境写入
- ❌ 改动超过必要范围

## 参考

- 仓库：https://github.com/duo121/ui-error-snapshot
- npm：`@duo121/ui-error-snapshot-*`

# ↑↑↑ 复制到此为止 ↑↑↑
