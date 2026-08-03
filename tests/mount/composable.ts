import { createApp, type App } from "vue";

interface Box<T> {
  value: T;
}

/**
 * Runs a composable inside a real component setup() — for composables that
 * need an instance (getCurrentInstance, provide/inject, lifecycle) without a
 * template. Call `app.unmount()` when the test needs disposal to run.
 */
export const withSetup = <T>(composable: () => T): { result: T; app: App } => {
  let box: Box<T> | undefined;
  const app = createApp({
    setup() {
      box = { value: composable() };
      return () => {};
    },
  });
  app.mount(document.createElement("div"));
  if (!box) {
    throw new Error("withSetup: setup() did not run");
  }
  return { result: box.value, app };
};
