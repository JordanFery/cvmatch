import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      // See src/lib/testing/server-only-stub.ts for why this is aliased.
      "server-only": path.resolve(import.meta.dirname, "./src/lib/testing/server-only-stub.ts"),
    },
  },
  test: {
    environment: "node",
  },
});
