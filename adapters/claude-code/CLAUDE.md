# Claude Code snippet

Add to `CLAUDE.md`:

```markdown
## UI error snapshot

When verifying dev UI work, run:

```bash
npx @ui-error-snapshot/cli check
```

Non-zero exit means a red-screen-level error was written to the snapshot file. Read stderr and fix before completing the task.

Path: `npx @ui-error-snapshot/cli path`
```

Phase 2 will ship an MCP server with `ui_error_snapshot_read` / `ui_error_snapshot_clear` tools.
