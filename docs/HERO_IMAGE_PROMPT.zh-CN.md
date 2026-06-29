# GPT Image 2 — Hero 头图提示词

将生成结果保存为 `docs/assets/hero.png`，然后在 README 顶部取消 hero 图注释。

---

## 推荐提示词（中文，直接复制）

```
为开源项目 ui-error-snapshot 设计一张 GitHub 仓库 Hero 横幅图，比例 16:9，分辨率 1920×1080。

主题：帮助 AI 编程 Agent 在 dev 红屏时无需截图即可读取错误。

画面分三段从左到右：

1. 左侧：深色开发界面，Electron 桌面应用出现粉红色 Dev 红屏报错浮层，标题 "Uncaught Error"，可见代码行与 stack trace，氛围紧张。

2. 中间：一条发光箭头指向一个简洁的本地文本文件图标，文件名 `ui-error-snapshot.txt`，路径 `~/.ui-error-snapshot/`，表示错误被自动写入本地。

3. 右侧：友好的 AI Agent 机器人（抽象、非品牌 Logo）正在终端执行 `ui-error-snapshot-cli check`，终端显示 `RangeError: 1/0` 和完整 stack，机器人旁有绿色对勾，表示 Agent 已读懂错误、无需用户截图。

整体风格：现代开发者工具、深色背景、少量品红/珊瑚红点缀（呼应红屏）、青绿高亮（表示成功读取）。扁平插画 + 轻微玻璃拟态，不要 3D 写实人物，不要 Agnx/Cursor/OpenAI 商标。

顶部大标题英文：`ui-error-snapshot`
副标题英文：`Dev red-screen errors → local file → AI agents read without screenshots`

底部小字：`npm · Cursor · Codex · Claude Code`

要求：文字清晰可读、构图干净、适合 GitHub README 首屏，留足上下边距。
```

---

## 英文备选（若中文模型效果不佳）

```
Design a 16:9 GitHub repository hero banner (1920x1080) for the open-source project "ui-error-snapshot".

Story (left to right):
1) Dark dev UI with a pink/red React-style error overlay ("Uncaught Error", code snippet, stack trace).
2) Glowing arrow to a local text file `~/.ui-error-snapshot/ui-error-snapshot.txt`.
3) AI coding agent at a terminal running `ui-error-snapshot-cli check`, showing RangeError stack — green checkmark, no screenshot needed.

Style: modern dev-tool aesthetic, dark background, coral-red accents, teal success highlights, flat illustration with subtle glassmorphism. No branded logos.

Headline: ui-error-snapshot
Subhead: Dev red-screen errors → local file → AI agents read without screenshots
Footer: npm · Cursor · Codex · Claude Code
```

---

## 生成后

1. 保存为 `docs/assets/hero.png`（建议宽度 ≤ 1600px，PNG < 300KB）
2. 在 `README.md` / `README.zh-CN.md` 顶部 hero 行取消注释
3. `git add docs/assets/hero.png README*.md && git commit && git push`
