import type { Config, State } from "@zoobzio/views";

import { useState } from "#app";
import { createViewsState } from "@zoobzio/views";

/**
 * The Nuxt backing for a views state container: one `useState` record
 * keyed `views-<id>`. Its value is a reactive proxy, so the service's
 * field writes are tracked; instances sharing an id share the container
 * across the app, and it survives SSR hydration. `config` shapes the
 * record once, when it is first created, its `views` and `initial`
 * included; later calls under the same id get the record as it stands.
 */
export const accessViews = <P>(id: string, config: Config<P>): State<P> =>
  useState<State<P>>(`views-${id}`, () => createViewsState(config)).value;
