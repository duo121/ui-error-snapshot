import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createFileSink } from "@duo121/ui-error-snapshot-sink-file";
import { installBrowserErrorSnapshot } from "@duo121/ui-error-snapshot-hook-browser";
import { App } from "./App";

if (import.meta.env.DEV) {
  const sink = createFileSink();
  installBrowserErrorSnapshot({
    enabled: true,
    write: (text) => sink.write(text),
    clear: () => sink.clear(),
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
