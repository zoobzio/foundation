import { beforeEach } from "vitest";
import {
  clearNuxtHooks,
  clearNuxtLoggers,
  clearNuxtStateRegistry,
} from "#test/mocks/imports";

// Shared useState refs and hook listeners (see mocks/imports.ts) must not
// leak between tests.
beforeEach(() => {
  clearNuxtStateRegistry();
  clearNuxtHooks();
  clearNuxtLoggers();
});
