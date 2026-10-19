import type { Config, State } from "../types/data/deck";

import { useState } from "#imports";
import { createDeckState } from "@zoobzio/deck";

/**
 * The Nuxt backing for a deck's state container: one `useState` record
 * keyed `deck-<id>`. Its value is a reactive proxy, so the service's field
 * writes are tracked; instances sharing an id share the container across
 * the app and it survives SSR hydration.
 */
export const accessDeck = <T>(id: string, config: Config<T>): State<T> =>
  useState<State<T>>(`deck-${id}`, () => createDeckState(config)).value;
