# Vite + React 可运行示例

演示 dev 红屏 → 本地快照 → CLI / MCP 读取。

## 前置

在仓库根目录先构建 workspace 包：

```bash
cd ../..
npm install
npm run build
```

## 运行

```bash
cd examples/vite-react
npm install
npm run dev
```

浏览器打开页面，点击 **Trigger red-screen error**。

另开终端：

```bash
npm run probe:ui-error-snapshot   # 验证写入链路
npm run check:ui-error-snapshot   # exit 1 + stack
```

默认快照路径：`~/.ui-error-snapshot/ui-error-snapshot.txt`
