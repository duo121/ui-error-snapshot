import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  isDevEnvironment,
  resolveSnapshotPaths,
  type ResolveSnapshotPathsOptions,
} from "@duo121/ui-error-snapshot-core";

export interface FileSinkOptions extends ResolveSnapshotPathsOptions {
  /** When false, all writes are no-ops. Defaults to isDevEnvironment(). */
  enabled?: boolean;
}

export interface FileSink {
  clear: () => Promise<void>;
  write: (text: string) => Promise<void>;
  read: () => Promise<string>;
  snapshotPath: string;
}

export function createFileSink(options: FileSinkOptions = {}): FileSink {
  const { snapshotPath } = resolveSnapshotPaths(options);
  const enabled = options.enabled ?? isDevEnvironment(options.env);

  async function ensureParentDir(): Promise<void> {
    await mkdir(dirname(snapshotPath), { recursive: true });
  }

  return {
    snapshotPath,
    async clear() {
      if (!enabled) return;
      await ensureParentDir();
      await writeFile(snapshotPath, "", "utf8");
    },
    async write(text) {
      if (!enabled) return;
      const normalized = text.trim();
      if (!normalized) return;
      await ensureParentDir();
      await writeFile(snapshotPath, normalized, "utf8");
    },
    async read() {
      try {
        return (await readFile(snapshotPath, "utf8")).trim();
      } catch {
        return "";
      }
    },
  };
}

/** Node-side helpers matching Agnx desktop IPC semantics. */
export async function clearUiErrorSnapshot(
  options: FileSinkOptions = {},
): Promise<void> {
  await createFileSink(options).clear();
}

export async function writeUiErrorSnapshot(
  text: unknown,
  options: FileSinkOptions = {},
): Promise<void> {
  const normalized =
    typeof text === "string" ? text.trim() : String(text ?? "").trim();
  await createFileSink(options).write(normalized);
}

export async function readUiErrorSnapshot(
  options: FileSinkOptions = {},
): Promise<string> {
  return createFileSink(options).read();
}
