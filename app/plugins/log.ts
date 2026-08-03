import { useLogger } from "#foundation/composables/log";
import { LOG_ROOT_NAME } from "#foundation/constants/log";
import { defineNuxtPlugin } from "#imports";

/**
 * Provides the root logger on the Nuxt app (`nuxt.$log`) so code that
 * holds the app instance — services in particular — can log without
 * resolving the composable from setup scope.
 */
export default defineNuxtPlugin(() => {
  return {
    provide: {
      log: useLogger(LOG_ROOT_NAME),
      logger: useLogger,
    },
  };
});
