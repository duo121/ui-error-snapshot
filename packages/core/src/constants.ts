/** Default filename written by all sinks. */
export const SNAPSHOT_FILENAME = "ui-error-snapshot.txt";

/** Marker string used by probe commands to verify the write pipeline. */
export const PROBE_MARKER = "UI_ERROR_SNAPSHOT_PROBE";

/** Default home directory name under the user home folder. */
export const DEFAULT_HOME_DIR = ".ui-error-snapshot";

/** Environment variable overriding the snapshot home directory. */
export const ENV_HOME = "UI_ERROR_HOME";

/** Legacy Agnx-compatible env (optional fallback when migrating). */
export const ENV_LEGACY_AGNX_HOME = "AGNX_HOME";

export interface SnapshotPaths {
  homeDir: string;
  snapshotPath: string;
}

export interface FormatErrorOptions {
  /** Prefix for probe messages (defaults to PROBE_MARKER). */
  probeMarker?: string;
}
