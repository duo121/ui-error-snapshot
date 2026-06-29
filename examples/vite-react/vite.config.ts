import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-native": fileURLToPath(new URL("./src/react-native-stub.ts", import.meta.url)),
    },
  },
});
