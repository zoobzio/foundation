import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      // Nuxt's entry and virtual modules — shimmed for the no-Nuxt vitest
      // environment. Exact matches: a bare "#app" prefix would also catch
      // the NuxtLink path, which has its own shim.
      { find: /^#app$/, replacement: r("./tests/mocks/app.ts") },
      {
        find: /^#app\/components\/nuxt-link$/,
        replacement: r("./tests/mocks/nuxt-link.ts"),
      },
      // The shell built-ins app.vue renders, and the Icon the wrappers draw.
      { find: /^#components$/, replacement: r("./tests/mocks/components.ts") },
      // Test-only support (mocks, stubs, data, mount factories).
      { find: /^#test/, replacement: r("./tests") },
    ],
  },
  test: {
    environment: "happy-dom",
    // One happy-dom per worker; VM contexts still isolate each test file.
    pool: "vmThreads",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
    coverage: {
      include: ["app/**/*.{ts,vue}"],
      reportsDirectory: ".coverage",
    },
  },
});
