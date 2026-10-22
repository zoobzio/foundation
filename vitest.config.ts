import { defineConfig } from "vitest/config";

/**
 * The root vitest config. Each package has its own `vitest.config.ts`. This
 * config lists them as projects for a root `vitest` run. `pnpm test` runs the
 * packages in parallel through turbo; `pnpm coverage` runs them here, in one
 * process, for a single aggregated report.
 */
export default defineConfig({
  test: {
    projects: [
      "packages/*/vitest.config.ts",
      "integrations/*/vitest.config.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: ".coverage",
      include: [
        "packages/*/src/**/*.{ts,vue}",
        "integrations/vue/src/**/*.{ts,vue}",
        "integrations/nuxt/app/**/*.{ts,vue}",
        "integrations/nuxt/modules/**/*.ts",
      ],
    },
  },
});
