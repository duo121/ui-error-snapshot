#!/usr/bin/env node
// 场景：stdio MCP，供 Cursor/Claude 等 Agent 读取 dev 红屏快照文件。
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  clearSnapshotTool,
  pathSnapshotTool,
  probeSnapshotTool,
  readSnapshotTool,
} from "./tools.js";

const server = new McpServer({ name: "ui-error-snapshot", version: "0.1.0" });

server.tool("ui_error_snapshot_read", "Read dev UI error snapshot file", {}, async () => {
  const result = await readSnapshotTool();
  const summary = result.hasError
    ? `Uncaught UI error captured at ${result.path}`
    : `No UI error in snapshot (${result.path})`;
  return {
    content: [
      {
        type: "text",
        text: result.hasError ? `${summary}\n\n${result.content}` : summary,
      },
    ],
    structuredContent: { ...result },
  };
});

server.tool("ui_error_snapshot_clear", "Clear dev UI error snapshot file", {}, async () => {
  const result = await clearSnapshotTool();
  return {
    content: [{ type: "text", text: `Cleared ${result.path}` }],
    structuredContent: { ...result },
  };
});

server.tool("ui_error_snapshot_probe", "Write probe marker to verify snapshot pipeline", {}, async () => {
  const result = await probeSnapshotTool();
  if (!result.ok) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Probe failed: marker missing in ${result.path}\n${result.content}`,
        },
      ],
      structuredContent: { ...result },
    };
  }
  return {
    content: [
      {
        type: "text",
        text: `Probe ok: ${result.path}\n${result.content}`,
      },
    ],
    structuredContent: { ...result },
  };
});

server.tool("ui_error_snapshot_path", "Return resolved snapshot file path", {}, async () => {
  const result = pathSnapshotTool();
  return {
    content: [{ type: "text", text: result.path }],
    structuredContent: { ...result },
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
