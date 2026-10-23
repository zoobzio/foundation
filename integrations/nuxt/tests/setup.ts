import { beforeEach } from "vitest";
import {
  clearNuxtHooks,
  clearNuxtLoggers,
  clearNuxtStateRegistry,
} from "#test/mocks/app";

// Shared useState refs and hook listeners (see mocks/app.ts) must not
// leak between tests.
beforeEach(() => {
  clearNuxtStateRegistry();
  clearNuxtHooks();
  clearNuxtLoggers();
});
