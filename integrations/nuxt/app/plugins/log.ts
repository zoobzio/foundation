import { defineNuxtPlugin } from "#imports";
import { useLogger } from "../composables/log";
import { LOG_ROOT_NAME } from "../constants/log";

/**
 * Provides the root logger as `nuxt.$log` and the logger constructor as
 * `nuxt.$logger`, so code that holds the app instance (the factories in
 * particular) can log without resolving the composable from setup scope.
 */
export default defineNuxtPlugin(() => {
  return {
    provide: {
      log: useLogger(LOG_ROOT_NAME),
      logger: useLogger,
    },
  };
});
