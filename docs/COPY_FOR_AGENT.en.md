# ↓↓↓ Copy everything below and paste to your Agent ↓↓↓

Integrate **ui-error-snapshot** into the current project so dev uncaught UI errors are written to a local file you can read later. Do not clone the repo or run a separate daemon.

---

# Agent integration task: ui-error-snapshot (minimal intrusion)

You are a coding agent. Integrate **ui-error-snapshot** into the **current user project**.

## Goals

- User must **not** clone the ui-error-snapshot repo or run a separate daemon.
- Intrusion: **~5 lines in app entry** + **one package.json script** + **one agent rule**.
- After integration: `npm run check:ui-error-snapshot` or `npx @duo121/ui-error-snapshot-cli check`; exit 1 = red-screen captured.

## Contract

- Path: `~/.ui-error-snapshot/ui-error-snapshot.txt` (override with `UI_ERROR_HOME`)
- Overwrite on uncaught errors; **dev only**
- Probe: `UI_ERROR_SNAPSHOT_PROBE`

## Default mode A

```bash
npm install -D @duo121/ui-error-snapshot-hook-browser @duo121/ui-error-snapshot-sink-file @duo121/ui-error-snapshot-cli
```

Wire browser hook at dev entry, add check/probe scripts, add Cursor/AGENTS/CLAUDE rule.

Full steps: https://github.com/duo121/ui-error-snapshot/blob/main/docs/INTEGRATION_PROMPT.en.md

## Do not

Clone repo into user project; start background service; write in production; refactor unrelated code.

# ↑↑↑ Copy to here ↑↑↑
