import { describe, expect, it } from "vitest";
import { buildProbeMessage, formatUiError, PROBE_MARKER } from "./index.js";
import { resolveSnapshotPaths } from "./paths.js";

describe("formatUiError", () => {
  it("formats Error with stack", () => {
    const err = new Error("boom");
    expect(formatUiError(err)).toContain("Error: boom");
  });

  it("formats strings", () => {
    expect(formatUiError("  hello  ")).toBe("hello");
  });
});

describe("buildProbeMessage", () => {
  it("includes default probe marker", () => {
    expect(buildProbeMessage()).toContain(PROBE_MARKER);
  });
});

describe("resolveSnapshotPaths", () => {
  it("prefers UI_ERROR_HOME", () => {
    const paths = resolveSnapshotPaths({
      env: { UI_ERROR_HOME: "/tmp/custom-home" },
    });
    expect(paths.homeDir).toBe("/tmp/custom-home");
    expect(paths.snapshotPath.endsWith("ui-error-snapshot.txt")).toBe(true);
  });
});
