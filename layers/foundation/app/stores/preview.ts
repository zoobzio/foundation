import type { State } from "../types/data/preview";

import { useState } from "#imports";
import { createPreviewState } from "@zoobzio/preview";

/**
 * The Nuxt backing for a preview's state container: one `useState` record
 * keyed `preview-<id>`. Its value is a reactive proxy, so the service's
 * field writes are tracked; instances sharing an id share the container
 * across the app and it survives SSR hydration. No config parameter — the
 * defaults derive from nothing.
 */
export const accessPreview = <T>(id: string): State<T> =>
  useState<State<T>>(`preview-${id}`, () => createPreviewState<T>()).value;
