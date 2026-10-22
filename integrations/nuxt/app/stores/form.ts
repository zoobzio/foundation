import type { FormInitial } from "../types/form";
import type { Config, State } from "@zoobzio/form";

import { useState } from "#imports";
import { createFormState } from "@zoobzio/form";
import { seed } from "../utils/state";

/**
 * The Nuxt backing for a form's state container: one `useState` record
 * keyed `form-<id>`. Its value is a reactive proxy, so the service's field
 * writes are tracked; instances sharing an id share the container across
 * the app, and it survives SSR hydration. `config` (its defaults) and
 * `initial` shape the record once, when it is first created; later calls
 * under the same id get the record as it stands.
 */
export const accessForm = <T>(
  id: string,
  config: Config<T>,
  initial?: FormInitial<T>,
): State<T> =>
  useState<State<T>>(`form-${id}`, () => seed(createFormState(config), initial))
    .value;
