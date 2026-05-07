import {
  defineNuxtModule,
  addTemplate,
  addPlugin,
  addImports,
  addRouteMiddleware,
  addTypeTemplate,
  createResolver,
  useLogger,
} from "@nuxt/kit";

import type { RampartConfig } from "./types";

const logger = useLogger("rampart");

export default defineNuxtModule<RampartConfig>({
  meta: {
    name: "rampart",
    configKey: "rampart",
  },
  setup(options) {
    const resolver = createResolver(import.meta.url);

    const basePath = options.basePath || "/auth";
    const publicRoutes = options.publicRoutes || [];
    const refreshThreshold = options.refreshThreshold || 600000;
    const forbiddenRoute = options.forbiddenRoute || "";
    const meCacheTTL = options.meCacheTTL ?? 300000;

    // Warn if no session secret is configured
    const secret = process.env.NUXT_RAMPART_SECRET || process.env.NUXT_SESSION_PASSWORD;
    if (!secret) {
      logger.warn("No session secret found. Set NUXT_RAMPART_SECRET or NUXT_SESSION_PASSWORD before running in production.");
    }

    // Virtual module — serializable config
    addTemplate({
      filename: "rampart.config.mjs",
      write: true,
      getContents: () => [
        `export const basePath = ${JSON.stringify(basePath)};`,
        `export const publicRoutes = ${JSON.stringify(publicRoutes)};`,
        `export const refreshThreshold = ${JSON.stringify(refreshThreshold)};`,
        `export const forbiddenRoute = ${JSON.stringify(forbiddenRoute)};`,
        `export const meCacheTTL = ${JSON.stringify(meCacheTTL)};`,
      ].join("\n"),
    });

    // Expose hook type augmentations to consumers
    addTypeTemplate({
      filename: "rampart.hooks.d.ts",
      getContents: () => `export {} from "${resolver.resolve("./hooks")}";`,
    });

    // Auto-import composables and helpers
    const composables = resolver.resolve("../runtime/composables");
    addImports([
      { name: "useAuth", from: composables },
      { name: "hasRole", from: composables },
      { name: "hasScope", from: composables },
      { name: "defineRoleMiddleware", from: composables },
      { name: "defineScopeMiddleware", from: composables },
    ]);

    // Register plugin for SSR hydration
    addPlugin(resolver.resolve("../runtime/plugin"));

    // Named route middleware — pages opt in via definePageMeta({ middleware: "auth" })
    addRouteMiddleware({
      name: "auth",
      path: resolver.resolve("../runtime/auth"),
    });
  },
});
