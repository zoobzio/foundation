import type { Config, State } from "../types/data/chart";

import { useState } from "#imports";
import { createChartState } from "@zoobzio/chart";

/**
 * The Nuxt backing for a chart's state container: one `useState` record
 * keyed `chart-<id>`. Its value is a reactive proxy, so the service's field
 * writes are tracked; instances sharing an id share the container across
 * the app and it survives SSR hydration.
 */
export const accessChart = <T>(id: string, config: Config<T>): State<T> =>
  useState<State<T>>(`chart-${id}`, () => createChartState(config)).value;
