import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: {
      // The package is generated: there is no source to cover.
      include: [],
      reportsDirectory: ".coverage",
    },
  },
});
