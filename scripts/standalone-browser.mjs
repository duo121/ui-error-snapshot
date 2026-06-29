#!/usr/bin/env node
// 场景：零 npm 依赖的单文件浏览器 hook + 文件 check（复制到用户项目 scripts/ 即可）。
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export const SNAPSHOT_FILENAME = "ui-error-snapshot.txt";
export const PROBE_MARKER = "UI_ERROR_SNAPSHOT_PROBE";

export function resolveSnapshotPath(env = process.env) {
  const home =
    env.UI_ERROR_HOME?.trim() ||
    env.AGNX_HOME?.trim() ||
    join(homedir(), ".ui-error-snapshot");
  return join(home, SNAPSHOT_FILENAME);
}

export function formatUiError(error) {
  if (error instanceof Error) {
    const stack = error.stack?.trim();
    return stack ? `${error.name}: ${error.message}\n${stack}` : `${error.name}: ${error.message}`;
  }
  if (typeof error === "string") return error.trim();
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function writeSnapshot(text, env = process.env) {
  if (env.NODE_ENV === "production") return;
  const normalized = String(text ?? "").trim();
  if (!normalized) return;
  const path = resolveSnapshotPath(env);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, normalized, "utf8");
}

export function clearSnapshot(env = process.env) {
  if (env.NODE_ENV === "production") return;
  writeSnapshot("", env);
}

export function readSnapshot(env = process.env) {
  const path = resolveSnapshotPath(env);
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8").trim();
}

/** Call from browser entry (dev only). Pass write/clear bound to Node or IPC in bundler context. */
export function installBrowserHooks({ enabled = true, write, clearOnInstall = true, clear }) {
  if (!enabled || typeof window === "undefined") return () => {};
  if (clearOnInstall && clear) void clear();
  const report = (err) => void write(formatUiError(err));
  const onError = (e) => report(e.error ?? e.message);
  const onRejection = (e) => report(e.reason);
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  window.__uiErrorSnapshotProbe = () =>
    void write(`Error: ${PROBE_MARKER}\n    at __uiErrorSnapshotProbe`);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
    delete window.__uiErrorSnapshotProbe;
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const cmd = process.argv[2];
  if (cmd === "check") {
    const content = readSnapshot();
    if (content) {
      process.stderr.write(`${content}\n`);
      process.exit(1);
    }
    process.exit(0);
  }
  if (cmd === "probe") {
    process.env.NODE_ENV = process.env.NODE_ENV ?? "development";
    writeSnapshot(`Error: ${PROBE_MARKER}\n    at standalone-browser.mjs probe`);
    console.log(readSnapshot());
    process.exit(0);
  }
  if (cmd === "path") {
    console.log(resolveSnapshotPath());
    process.exit(0);
  }
  console.log("Usage: node standalone-browser.mjs check|probe|path");
  process.exit(2);
}
