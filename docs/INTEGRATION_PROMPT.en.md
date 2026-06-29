# Agent integration task: ui-error-snapshot (minimal intrusion)

You are a coding agent. Integrate **ui-error-snapshot** into the **current user project** so uncaught dev UI errors are written to a local file you can read on later turns.

## Goals

- The user must **not** clone the ui-error-snapshot repo or run a separate daemon/process.
- Intrusion budget: **~5 lines in the app entry** + **one package.json script** + **one agent rule paragraph**.
- After integration you can run `npm run check:ui-error-snapshot` (or `npx @ui-error-snapshot/cli check`); exit code 1 means a red-screen-level error was captured.

## Contract (required)

- File path: `$UI_ERROR_HOME/ui-error-snapshot.txt`, default `~/.ui-error-snapshot/ui-error-snapshot.txt`
- Write semantics: **overwrite**, uncaught errors only, **dev only**
- Probe marker: `UI_ERROR_SNAPSHOT_PROBE`

## Step 1: Detect stack

Priority order:

1. **Electron desktop** (main/preload/renderer split) → renderer hook + main-process file IPC (Agnx-style)
2. **Vite / Webpack / Next / CRA** → browser hook + Node file sink (or IPC if renderer cannot write files)
3. **Expo / RN Web** → hook-browser; ErrorUtils may be undefined — probe safely
4. **Pure Node CLI, no UI** → **skip**; tell the user this does not apply

## Step 2: Pick integration mode (default A)

### Mode A — npm devDependency (recommended)

```bash
npm install -D @ui-error-snapshot/hook-browser @ui-error-snapshot/sink-file @ui-error-snapshot/cli
```

At the **earliest dev entry** (e.g. `main.tsx`, `_layout.tsx`, `index.js`):

```ts
if (import.meta.env?.DEV ?? process.env.NODE_ENV !== "production") {
  const { createFileSink } = await import("@ui-error-snapshot/sink-file");
  const { installBrowserErrorSnapshot } = await import("@ui-error-snapshot/hook-browser");
  const sink = createFileSink();
  installBrowserErrorSnapshot({
    enabled: true,
    write: (t) => sink.write(t),
    clear: () => sink.clear(),
  });
}
```

`package.json` scripts:

```json
{
  "scripts": {
    "check:ui-error-snapshot": "ui-error-snapshot check",
    "probe:ui-error-snapshot": "ui-error-snapshot probe"
  }
}
```

### Mode B — single file, zero npm (when user refuses new deps)

Copy `scripts/standalone-browser.mjs` from the ui-error-snapshot repo into the user project `scripts/`. Dynamic-import from entry; no npm packages. Use the same file for `node scripts/standalone-browser.mjs check`.

### Mode C — agent rule only (existing crash file)

If the project already writes a similar file, only unify the path and add a check script — do not duplicate hooks.

## Step 3: Agent rules

Add one paragraph (pick what applies):

- **Cursor**: `.cursor/rules/ui-error-snapshot.mdc` — run `npm run check:ui-error-snapshot` before finishing UI tasks
- **Codex / generic**: same in `AGENTS.md`
- **Claude Code**: same in `CLAUDE.md`

Templates: https://github.com/duo121/ui-error-snapshot/tree/main/adapters

## Step 4: Verification

1. `npm run probe:ui-error-snapshot` → file contains `UI_ERROR_SNAPSHOT_PROBE`
2. `npm run check:ui-error-snapshot` → exit 1 and stderr has stack
3. Restart dev app → file cleared → check exit 0
4. Report to user: changed files, snapshot path, how to probe manually

## Do not

- ❌ Ask the user to clone ui-error-snapshot into their project
- ❌ Start a standalone daemon or second dev server
- ❌ Write in production
- ❌ Change more than necessary (no unrelated refactors)

## References

- Repo: https://github.com/duo121/ui-error-snapshot
- npm packages: `@ui-error-snapshot/*`

**中文版本：** [INTEGRATION_PROMPT.zh-CN.md](./INTEGRATION_PROMPT.zh-CN.md)
