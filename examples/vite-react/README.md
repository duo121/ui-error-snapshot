# Vite + React example (sketch)

1. Install packages in your app workspace.
2. In `src/main.tsx` (dev only):

```ts
import { installBrowserErrorSnapshot } from "@ui-error-snapshot/hook-browser";
import { createFileSink } from "@ui-error-snapshot/sink-file";

if (import.meta.env.DEV) {
  const sink = createFileSink({ homeDir: import.meta.env.VITE_UI_ERROR_HOME });
  installBrowserErrorSnapshot({
    enabled: true,
    write: (t) => sink.write(t),
    clear: () => sink.clear(),
  });
}
```

3. Agent verification: `npx @ui-error-snapshot/cli check`

A full runnable example will be added in a follow-up PR.
