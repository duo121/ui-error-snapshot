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
| Phase 1 — Core + npm | ✅ Published | ~95% (CLI 0.1.1 bin fix pending) |
| Phase 1.5 — Docs & DX | ✅ Mostly done | ~90% (runnable example pending) |
| Phase 2 — MCP server | ⏳ Not started | 0% |
| Phase 3 — IDE adapters | 🔶 Skeleton | ~30% |
| Phase 4 — Advanced | 📋 Planned | 0% |

---

## Phase 1 — Core packages + CLI ✅

Delivered on npm as `@duo121/ui-error-snapshot-{core,sink-file,hook-browser,cli}@0.1.0`.

**Remaining:**

- [ ] Publish CLI `0.1.1` (bin field fix)
- [ ] Align `packages/cli` name with `@duo121/*`
- [ ] Configure `NPM_TOKEN` for GitHub Actions publish

---

## Phase 1.5 — Docs & onboarding ✅ (in progress)

- [x] README hero + demo screenshots
- [x] Copy-for-agent prompts (zh/en)
- [ ] Runnable `examples/vite-react`
- [ ] Update adapters to `@duo121/*` install commands

---

## Phase 2 — MCP server ⏳

Package: `@duo121/ui-error-snapshot-mcp`

| Tool | Purpose |
|------|---------|
| `ui_error_snapshot_read` | Read snapshot file |
| `ui_error_snapshot_clear` | Clear on dev restart |
| `ui_error_snapshot_probe` | Write probe marker |
| `ui_error_snapshot_path` | Resolved absolute path |

See Chinese doc for full contract and acceptance criteria.

---

## Phase 3 — IDE adapters 🔶

Polish Cursor / Codex / Claude Code / OpenCode snippets; MCP-first where supported.

---

## Phase 4 — Advanced 📋

Watch mode, multi-workspace filenames, Electron IPC template, optional JSON sink.

---

## Recommended order

1. Phase 1 tail (CLI 0.1.1)
2. Runnable example
3. Phase 2 MCP
4. Phase 3 adapters
5. Phase 4 as needed
