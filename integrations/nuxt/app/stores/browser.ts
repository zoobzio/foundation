import type { BrowserInitial } from "../types/browser";
import type { State } from "@zoobzio/browser";

import { useState } from "#app";
import { createBrowserState } from "@zoobzio/browser";
import { seed } from "../utils/state";

/**
 * The Nuxt backing for a browser's state container: one `useState` record
 * keyed `browser-<id>`. Its value is a reactive proxy, so the service's
 * field writes are tracked; instances sharing an id share the container
 * across the app, and it survives SSR hydration. No config parameter: the
 * trail starts at the root and sorting starts unset, unless `initial` says
 * otherwise. It shapes the record once, when it is first created; later
 * calls under the same id get the record as it stands.
 */
export const accessBrowser = <T>(
  id: string,
  initial?: BrowserInitial<T>,
): State<T> =>
  useState<State<T>>(`browser-${id}`, () =>
    seed(createBrowserState<T>(), initial),
  ).value;
