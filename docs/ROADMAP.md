# ui-error-snapshot Roadmap

> Last updated: 2026-06-29 · Repo: https://github.com/duo121/ui-error-snapshot

**中文：** [路线图_ROADMAP.zh-CN.md](./路线图_ROADMAP.zh-CN.md)

---

## Vision

Let any AI coding agent read dev red-screen errors from a **stable local file** — no screenshots.

```text
Dev crash → hook → ~/.ui-error-snapshot/ui-error-snapshot.txt → CLI check / MCP read
```

---

## Progress overview

| Phase | Status | Done |
|-------|--------|------|
| Phase 1 — Core + npm | ✅ Published | 100% |
| Phase 1.5 — Docs & DX | ✅ Done | 100% |
| Phase 2 — MCP server | ✅ Published | 100% |
| Phase 3 — IDE adapters | ✅ Done | 95% |
| Phase 4 — Advanced | 📋 On demand | 0% |

---

## Phase 1 — Core packages + CLI ✅

| Package | npm | Version |
|---------|-----|---------|
| core | `@duo121/ui-error-snapshot-core` | 0.1.0 |
| sink-file | `@duo121/ui-error-snapshot-sink-file` | 0.1.0 |
| hook-browser | `@duo121/ui-error-snapshot-hook-browser` | 0.1.0 |
| cli | `@duo121/ui-error-snapshot-cli` | 0.1.1 |

**Optional:** GitHub Actions `NPM_TOKEN` for OTP-free publish.

---

## Phase 1.5 — Docs & DX ✅

- [x] Bilingual README + hero + demo screenshots
- [x] [COPY_FOR_AGENT.en.md](./COPY_FOR_AGENT.en.md) / [复制给Agent.zh-CN.md](./复制给Agent.zh-CN.md)
- [x] Runnable [examples/vite-react](../examples/vite-react/)
- [x] `@duo121/*` scope unified

---

## Phase 2 — MCP server ✅

**npm:** `@duo121/ui-error-snapshot-mcp@0.1.3`

Tools: `ui_error_snapshot_read` · `clear` · `probe` · `path`

Setup: [MCP_SETUP.md](./MCP_SETUP.md)

> Note: `npx` may fail inside the ui-error-snapshot monorepo root (workspace link); works in user projects.

---

## Phase 3 — IDE adapters ✅

| IDE | Artifact |
|-----|----------|
| Cursor | [adapters/cursor/ui-error-snapshot.mdc](../adapters/cursor/ui-error-snapshot.mdc) |
| Codex | [adapters/codex/AGENTS.md](../adapters/codex/AGENTS.md) |
| Claude Code | [adapters/claude-code/CLAUDE.md](../adapters/claude-code/CLAUDE.md) |
| OpenCode | [adapters/opencode/README.md](../adapters/opencode/README.md) |

---

## Phase 4 — Advanced 📋

| Feature | Priority |
|---------|----------|
| GitHub Actions + `NPM_TOKEN` | Medium |
| `watch` mode | Low |
| Multi-workspace files | Medium |
| Electron IPC package | Medium |
| JSON sink | Low |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-29 | Initial roadmap |
| 2026-06-29 | Phase 1–3 complete; MCP 0.1.3 on npm |
