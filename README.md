# ui-error-snapshot

> Dev UI crash snapshots that AI coding agents can read — no screenshots required.

When your dev app hits a red screen, agents usually guess from screenshots or stale logs. **ui-error-snapshot** captures uncaught renderer errors into a single local file with a stable contract. Any agent loop (Cursor, Codex CLI, Claude Code, OpenCode, CI) can `check` before claiming success.

Born from production use in [Agnx](https://github.com/getagnx/agnx).

**中文文档：** [README.zh-CN.md](./README.zh-CN.md) · **One-shot agent prompt:** [INTEGRATION_PROMPT.en.md](./docs/INTEGRATION_PROMPT.en.md) · [INTEGRATION_PROMPT.zh-CN.md](./docs/INTEGRATION_PROMPT.zh-CN.md)

## Do I need to run a separate project?

**No.** There is no daemon, no second dev server, and nothing to keep running in the background.

| Mode | Change to your app | When |
|------|-------------------|------|
| **A. devDependency (default)** | ~5 lines in entry, 1 npm script, 1 agent rule | npm-based frontends |
| **B. Single-file script** | Copy `scripts/standalone-browser.mjs`, no npm packages | Minimal / no new deps |
| **C. Agent rule only** | Zero code if you already write a crash file | Unify contract only |

**Not recommended:** cloning this repo into the user project or running ui-error-snapshot as a standalone service.

**For end users:** copy the integration prompt to your agent — see [docs/INTEGRATION_PROMPT.zh-CN.md](./docs/INTEGRATION_PROMPT.zh-CN.md).

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Dev Host Application                      │
│  Electron · RN Web · Vite · Next · Expo …                     │
├──────────────────────────────────────────────────────────────┤
│  Hook Layer (@ui-error-snapshot/hook-browser)                 │
│  ├─ window.error / unhandledrejection                           │
│  ├─ ErrorUtils.setGlobalHandler (RN, optional)                  │
│  └─ window.__uiErrorSnapshotProbe() (dev verification)          │
└───────────────────────────┬──────────────────────────────────┘
                            │ formatUiError()
                            v
┌──────────────────────────────────────────────────────────────┐
│              @ui-error-snapshot/core                            │
│  normalize · paths · probe marker · dev gate                    │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            v
┌──────────────────────────────────────────────────────────────┐
│              @ui-error-snapshot/sink-file                       │
│  overwrite write → $UI_ERROR_HOME/ui-error-snapshot.txt         │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            v
┌──────────────────────────────────────────────────────────────┐
│                   Agent / IDE Consumption                       │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│ CLI check    │ MCP (Phase 2)│ Cursor rules │ CI gate           │
│ probe · path │ read / clear │ AGENTS.md    │ exit code 1       │
└──────────────┴──────────────┴──────────────┴───────────────────┘
         │              │              │
         v              v              v
    Codex CLI      Claude Code      Cursor Agent
```

### Contract

| Item | Value |
|------|-------|
| Default path | `~/.ui-error-snapshot/ui-error-snapshot.txt` |
| Override | `UI_ERROR_HOME=/path/to/dir` |
| Write semantics | **Overwrite** on each uncaught error |
| Scope | **Dev only** (`NODE_ENV !== production`) |
| Probe marker | `UI_ERROR_SNAPSHOT_PROBE` |

## Quick start

```bash
git clone https://github.com/duo121/ui-error-snapshot.git
cd ui-error-snapshot
npm install
npm run build
npm test

# Verify file sink from CLI
npm run ui-error-snapshot -- probe
npm run ui-error-snapshot -- check   # exit 1 if non-empty
npm run ui-error-snapshot -- path
```

### Browser / Electron renderer

```ts
import { installBrowserErrorSnapshot } from "@ui-error-snapshot/hook-browser";
import { createFileSink } from "@ui-error-snapshot/sink-file";

const sink = createFileSink();

installBrowserErrorSnapshot({
  enabled: typeof __DEV__ !== "undefined" ? __DEV__ : process.env.NODE_ENV !== "production",
  write: (text) => sink.write(text),
  clear: () => sink.clear(),
});
```

For Electron, wire `write`/`clear` to your preload IPC instead of direct file I/O in the renderer.

### Agent loop (any IDE)

After UI-changing work, agents must run:

```bash
npx @ui-error-snapshot/cli check
```

- **Exit 0** — snapshot empty → no uncaught UI error observed  
- **Exit 1** — stderr prints the stack → fix before finishing

See [`adapters/`](./adapters/) for Cursor, Codex, Claude Code, and OpenCode snippets.

## Packages

| Package | Role |
|---------|------|
| `@ui-error-snapshot/core` | Formatting, paths, constants |
| `@ui-error-snapshot/sink-file` | Node file sink (overwrite) |
| `@ui-error-snapshot/hook-browser` | Window + optional RN ErrorUtils hooks |
| `@ui-error-snapshot/cli` | `check` · `probe` · `path` · `clear` |

## Roadmap

- [x] Phase 1 — core + file sink + CLI + tests
- [ ] Phase 2 — MCP server (`read_snapshot`, `clear_snapshot`)
- [ ] Phase 3 — per-IDE adapter polish + OpenCode extension research
- [ ] Phase 4 — optional watch / multi-workspace filenames

## License

MIT
