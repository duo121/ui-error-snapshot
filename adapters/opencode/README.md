# OpenCode adapter (draft)

OpenCode integration path is **TBD** — confirm extension / MCP entry points in your OpenCode version.

Interim approach (same as Codex):

1. Install hooks in your dev app via `@ui-error-snapshot/hook-browser` + file or IPC sink.
2. Add a post-task shell step: `ui-error-snapshot check`.
3. Point your OpenCode agent instructions at `adapters/codex/AGENTS.md` until a dedicated MCP package lands (Phase 2).

Contributions welcome once OpenCode plugin API is documented.
