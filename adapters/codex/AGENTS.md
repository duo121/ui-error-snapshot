# Codex / generic agent snippet

Add to your repo `AGENTS.md`:

```markdown
## Dev UI error snapshot

After frontend or Electron UI changes, before finishing:

```bash
npx @duo121/ui-error-snapshot-cli check
```

- Exit 0: no uncaught dev UI error recorded.
- Exit 1: stderr contains the stack from `~/.ui-error-snapshot/ui-error-snapshot.txt` — fix the crash first.

Optional wiring in `package.json`:

```json
{
  "scripts": {
    "check:ui-error-snapshot": "ui-error-snapshot check",
    "probe:ui-error-snapshot": "ui-error-snapshot probe"
  }
}
```
```
