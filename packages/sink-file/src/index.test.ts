import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PROBE_MARKER, buildProbeMessage } from "@duo121/ui-error-snapshot-core";
import { createFileSink } from "./index.js";

describe("createFileSink", () => {
  it("writes and clears snapshot file in dev mode", async () => {
    const homeDir = await mkdtemp(join(tmpdir(), "ui-error-snapshot-"));
    const sink = createFileSink({
      homeDir,
      env: { NODE_ENV: "development" },
    });

    await sink.clear();
    expect(await sink.read()).toBe("");

    const probe = buildProbeMessage();
    await sink.write(probe);
    const content = await readFile(sink.snapshotPath, "utf8");
    expect(content).toContain(PROBE_MARKER);
  });

  it("no-ops in production", async () => {
    const homeDir = await mkdtemp(join(tmpdir(), "ui-error-snapshot-prod-"));
    const sink = createFileSink({
      homeDir,
      env: { NODE_ENV: "production" },
    });
    await sink.write("should not persist");
    expect(await sink.read()).toBe("");
  });
});
