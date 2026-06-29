import {
  buildProbeMessage,
  PROBE_MARKER,
  resolveSnapshotPaths,
} from "@duo121/ui-error-snapshot-core";
import {
  clearUiErrorSnapshot,
  readUiErrorSnapshot,
  writeUiErrorSnapshot,
} from "@duo121/ui-error-snapshot-sink-file";

export interface SnapshotReadResult {
  hasError: boolean;
  content: string;
  path: string;
}

export async function readSnapshotTool(): Promise<SnapshotReadResult> {
  const content = await readUiErrorSnapshot();
  const { snapshotPath } = resolveSnapshotPaths();
  return {
    hasError: content.length > 0,
    content,
    path: snapshotPath,
  };
}

export async function clearSnapshotTool(): Promise<{ ok: true; path: string }> {
  await clearUiErrorSnapshot();
  const { snapshotPath } = resolveSnapshotPaths();
  return { ok: true, path: snapshotPath };
}

export async function probeSnapshotTool(): Promise<{
  ok: boolean;
  path: string;
  content: string;
}> {
  const previousEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = process.env.NODE_ENV ?? "development";
  const probe = buildProbeMessage();
  await writeUiErrorSnapshot(probe);
  const content = await readUiErrorSnapshot();
  if (previousEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = previousEnv;
  }
  const { snapshotPath } = resolveSnapshotPaths();
  return {
    ok: content.includes(PROBE_MARKER),
    path: snapshotPath,
    content,
  };
}

export function pathSnapshotTool(): { path: string } {
  const { snapshotPath } = resolveSnapshotPaths();
  return { path: snapshotPath };
}
