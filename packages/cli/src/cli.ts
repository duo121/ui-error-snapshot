#!/usr/bin/env node
// 场景：Agent/CI 检查、探针写入、打印 ui-error-snapshot 路径。
import { buildProbeMessage, PROBE_MARKER, resolveSnapshotPaths } from "@ui-error-snapshot/core";
import {
  clearUiErrorSnapshot,
  readUiErrorSnapshot,
  writeUiErrorSnapshot,
} from "@ui-error-snapshot/sink-file";

const USAGE = `ui-error-snapshot — dev UI crash file for AI agents

Usage:
  ui-error-snapshot check     Exit 1 if snapshot file is non-empty (red screen)
  ui-error-snapshot probe     Write probe marker and verify read-back
  ui-error-snapshot path      Print resolved snapshot file path
  ui-error-snapshot clear     Clear snapshot file (dev only)

Environment:
  UI_ERROR_HOME   Override snapshot home (default ~/.ui-error-snapshot)
  AGNX_HOME       Legacy fallback when migrating from Agnx
  NODE_ENV        Writes disabled when production
`;

async function cmdCheck(): Promise<number> {
  const content = await readUiErrorSnapshot();
  if (!content) {
    return 0;
  }
  process.stderr.write(`${content}\n`);
  return 1;
}

async function cmdProbe(): Promise<number> {
  process.env.NODE_ENV = process.env.NODE_ENV ?? "development";
  const probe = buildProbeMessage();
  await writeUiErrorSnapshot(probe);
  const content = await readUiErrorSnapshot();
  if (!content.includes(PROBE_MARKER)) {
    process.stderr.write(
      `[ui-error-snapshot] probe failed: marker missing in snapshot\n${content}\n`,
    );
    return 1;
  }
  const { snapshotPath } = resolveSnapshotPaths();
  console.log(`[ui-error-snapshot] ok: ${snapshotPath}`);
  console.log(content);
  return 0;
}

async function cmdPath(): Promise<number> {
  const { snapshotPath } = resolveSnapshotPaths();
  console.log(snapshotPath);
  return 0;
}

async function cmdClear(): Promise<number> {
  await clearUiErrorSnapshot();
  return 0;
}

async function main(): Promise<number> {
  const [command] = process.argv.slice(2);
  switch (command) {
    case "check":
      return cmdCheck();
    case "probe":
      return cmdProbe();
    case "path":
      return cmdPath();
    case "clear":
      return cmdClear();
    case undefined:
    case "-h":
    case "--help":
      process.stdout.write(USAGE);
      return 0;
    default:
      process.stderr.write(`Unknown command: ${command}\n\n${USAGE}`);
      return 2;
  }
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    process.stderr.write(String(error));
    process.exit(1);
  });
