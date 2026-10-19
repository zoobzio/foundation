import type { State } from "../types/data/browser";

import { useState } from "#imports";
import { createBrowserState } from "@zoobzio/browser";

/**
 * The Nuxt backing for a browser's state container: one `useState` record
 * keyed `browser-<id>`. Its value is a reactive proxy, so the service's
 * field writes are tracked; instances sharing an id share the container
 * across the app and it survives SSR hydration. No config parameter, unlike
 * most stores — the trail starts at the root and sorting starts unset.
 */
export const accessBrowser = <T>(id: string): State<T> =>
  useState<State<T>>(`browser-${id}`, () => createBrowserState<T>()).value;
