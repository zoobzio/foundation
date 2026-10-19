import type { Config, State } from "../types/data/form";

import { useState } from "#imports";
import { createFormState } from "@zoobzio/form";

/**
 * The Nuxt backing for a form's state container: one `useState` record
 * keyed `form-<id>`. Its value is a reactive proxy, so the service's field
 * writes are tracked; instances sharing an id share the container across
 * the app and it survives SSR hydration.
 */
export const accessForm = <T>(id: string, config: Config<T>): State<T> =>
  useState<State<T>>(`form-${id}`, () => createFormState(config)).value;
