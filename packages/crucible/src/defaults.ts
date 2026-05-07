import type { HookLevelMap } from "./types";

/** Default log level mapping for Nuxt runtime hooks. */
export const defaultHookLevels: HookLevelMap = {
  // App lifecycle — info
  "app:created": "info",
  "app:beforeMount": "debug",
  "app:mounted": "info",
  "app:rendered": "debug",
  "app:redirected": "info",
  "app:suspense:resolve": "debug",

  // App errors — error
  "app:error": "error",
  "app:error:cleared": "warn",
  "app:chunkError": "error",

  // Data
  "app:data:refresh": "debug",
  "app:manifest:update": "info",

  // Page navigation — info
  "page:start": "debug",
  "page:finish": "info",
  "page:transition:finish": "debug",
  "page:view-transition:start": "debug",
  "page:loading:start": "debug",
  "page:loading:end": "debug",

  // Vue internals
  "vue:setup": "debug",
  "vue:error": "error",

  // Dev
  "dev:ssr-logs": "debug",

  // Prefetch
  "link:prefetch": "debug",

  // Nitro server hooks
  "request": "debug",
  "beforeResponse": "debug",
  "afterResponse": "debug",
  "error": "error",
  "close": "info",
  "render:before": "debug",
  "render:response": "debug",
};
