import { PROBE_MARKER, type FormatErrorOptions } from "./constants.js";

/** Normalize any thrown/rejected value into a stable stack-friendly string. */
export function formatUiError(error: unknown): string {
  if (error instanceof Error) {
    const stack = error.stack?.trim();
    return stack
      ? `${error.name}: ${error.message}\n${stack}`
      : `${error.name}: ${error.message}`;
  }
  if (typeof error === "string") {
    return error.trim();
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/** Build a deterministic probe payload for pipeline verification. */
export function buildProbeMessage(options: FormatErrorOptions = {}): string {
  const marker = options.probeMarker ?? PROBE_MARKER;
  return `Error: ${marker}\n    at probeUiErrorSnapshotReporting`;
}
