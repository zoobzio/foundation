import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Test-only support (data, mount factories).
      "#test": r("./tests"),
    },
  },
  test: {
    environment: "happy-dom",
    // One happy-dom per worker; VM contexts still isolate each test file.
    pool: "vmThreads",
    include: ["tests/**/*.test.ts"],
    coverage: {
      include: ["src/**/*.{ts,vue}"],
      reportsDirectory: ".coverage",
    },
  },
});
