import { buildProbeMessage, formatUiError } from "@ui-error-snapshot/core";

type GlobalErrorHandler = (error: unknown, isFatal?: boolean) => void;

interface ErrorUtilsLike {
  getGlobalHandler: () => GlobalErrorHandler | undefined;
  setGlobalHandler: (handler: GlobalErrorHandler) => void;
}

export interface BrowserHookOptions {
  /** Must return true to install hooks (e.g. __DEV__). Defaults to true in browser tests. */
  enabled?: boolean;
  clearOnInstall?: boolean;
  write: (text: string) => void | Promise<void>;
  clear?: () => void | Promise<void>;
  /** Optional RN ErrorUtils provider (Electron web may omit). */
  readErrorUtils?: () => ErrorUtilsLike | null;
}

declare global {
  interface Window {
    __uiErrorSnapshotProbe?: () => void;
  }
}

function defaultReadErrorUtils(): ErrorUtilsLike | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const maybeUtils = require("react-native").ErrorUtils as ErrorUtilsLike | undefined;
    if (
      maybeUtils &&
      typeof maybeUtils.getGlobalHandler === "function" &&
      typeof maybeUtils.setGlobalHandler === "function"
    ) {
      return maybeUtils;
    }
  } catch {
    // Host has no RN ErrorUtils — window listeners only.
  }
  return null;
}

/** Dev-only probe: writes marker text without throwing. */
export function probeUiErrorSnapshot(options: Pick<BrowserHookOptions, "write">): void {
  void options.write(buildProbeMessage());
}

/**
 * Install uncaught error hooks in a browser / Electron renderer.
 * Chain existing ErrorUtils handler when present.
 */
export function installBrowserErrorSnapshot(options: BrowserHookOptions): () => void {
  const enabled = options.enabled ?? true;
  if (!enabled) {
    return () => {};
  }

  const readErrorUtils = options.readErrorUtils ?? defaultReadErrorUtils;
  const write = (error: unknown) => {
    void options.write(formatUiError(error));
  };

  if (options.clearOnInstall !== false && options.clear) {
    void options.clear();
  }

  const errorUtils = readErrorUtils();
  let previousGlobalHandler: GlobalErrorHandler | undefined;
  if (errorUtils) {
    previousGlobalHandler = errorUtils.getGlobalHandler();
    errorUtils.setGlobalHandler((error, isFatal) => {
      write(error);
      previousGlobalHandler?.(error, isFatal);
    });
  }

  const onError = (event: ErrorEvent) => {
    write(event.error ?? event.message);
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    write(event.reason);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    window.__uiErrorSnapshotProbe = () => probeUiErrorSnapshot(options);
  }

  return () => {
    if (errorUtils && previousGlobalHandler) {
      errorUtils.setGlobalHandler(previousGlobalHandler);
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      delete window.__uiErrorSnapshotProbe;
    }
  };
}
