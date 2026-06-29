// 场景：MCP 工具层单测，验证 read/clear/probe/path 与 sink-file 合同一致。
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PROBE_MARKER } from "@duo121/ui-error-snapshot-core";
import {
  clearSnapshotTool,
  pathSnapshotTool,
  probeSnapshotTool,
  readSnapshotTool,
} from "./tools.js";

describe("mcp tools", () => {
  let homeDir = "";

  beforeEach(async () => {
    homeDir = await mkdtemp(join(tmpdir(), "ui-error-snapshot-mcp-"));
    process.env.UI_ERROR_HOME = homeDir;
    process.env.NODE_ENV = "development";
    await clearSnapshotTool();
  });

  afterEach(() => {
    delete process.env.UI_ERROR_HOME;
  });

  it("read returns empty when no snapshot", async () => {
    const result = await readSnapshotTool();
    expect(result.hasError).toBe(false);
    expect(result.content).toBe("");
    expect(result.path).toContain("ui-error-snapshot.txt");
  });

  it("probe writes marker and read picks it up", async () => {
    const probe = await probeSnapshotTool();
    expect(probe.ok).toBe(true);
    expect(probe.content).toContain(PROBE_MARKER);

    const read = await readSnapshotTool();
    expect(read.hasError).toBe(true);
    expect(read.content).toContain(PROBE_MARKER);
  });

  it("clear empties snapshot file", async () => {
    await probeSnapshotTool();
    await clearSnapshotTool();
    const read = await readSnapshotTool();
    expect(read.hasError).toBe(false);

    const file = await readFile(pathSnapshotTool().path, "utf8");
    expect(file).toBe("");
  });
});
