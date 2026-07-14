import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Source aliases (must mirror nuxt.config).
      "#foundation": r("./app"),
      // Nuxt virtual modules — shimmed for the no-Nuxt vitest environment.
      "#imports": r("./tests/mocks/imports.ts"),
      "#app": r("./tests/mocks/imports.ts"),
      // Test-only support (data, helpers, stubs, fixtures).
      "#test": r("./tests"),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts", "app/**/*.test.ts"],
    coverage: {
      include: ["app/**/*.{ts,vue}"],
      reportsDirectory: ".coverage",
    },
  },
});
