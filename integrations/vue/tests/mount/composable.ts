import { createApp, type App } from "vue";

interface Box<T> {
  value: T;
}

/**
 * Runs a composable inside a real `setup()` without a template.
 * Call `app.unmount()` to run disposal.
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
