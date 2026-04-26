import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "happy-dom",
    include: ["layers/*/tests/**/*.test.ts"],
    setupFiles: [resolve(__dirname, "packages/testing/setup.ts")],
    coverage: {
      reportsDirectory: ".coverage",
    },
  },
});
