# Cursor rule snippet

Add to `.cursor/rules/ui-error-snapshot.mdc`:

```markdown
# UI error snapshot gate (dev)

After any change that can affect the dev UI:

1. Run `npx @ui-error-snapshot/cli check` (or `npm run check:ui-error-snapshot` if wired in package.json).
2. Exit code 1 means an uncaught UI error was captured — read stderr stack and fix before claiming done.
3. Default file: `~/.ui-error-snapshot/ui-error-snapshot.txt` (override with `UI_ERROR_HOME`).
4. Dev probe: in browser console, `window.__uiErrorSnapshotProbe?.()` then re-run check.
```
