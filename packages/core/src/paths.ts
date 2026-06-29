import { homedir } from "node:os";
import { join } from "node:path";
import {
  DEFAULT_HOME_DIR,
  ENV_HOME,
  ENV_LEGACY_AGNX_HOME,
  SNAPSHOT_FILENAME,
  type SnapshotPaths,
} from "./constants.js";

export interface ResolveSnapshotPathsOptions {
  env?: NodeJS.ProcessEnv;
  homeDir?: string;
}

/**
 * Resolve the snapshot home directory and full file path.
 *
 * Priority:
 * 1. `UI_ERROR_HOME`
 * 2. `AGNX_HOME` (legacy compatibility)
 * 3. `~/.ui-error-snapshot`
 */
export function resolveSnapshotPaths(
  options: ResolveSnapshotPathsOptions = {},
): SnapshotPaths {
  const env = options.env ?? process.env;
  const explicit =
    options.homeDir?.trim() ||
    env[ENV_HOME]?.trim() ||
    env[ENV_LEGACY_AGNX_HOME]?.trim();

  const homeDir = explicit || join(homedir(), DEFAULT_HOME_DIR);
  return {
    homeDir,
    snapshotPath: join(homeDir, SNAPSHOT_FILENAME),
  };
}

export function isDevEnvironment(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NODE_ENV !== "production";
}
