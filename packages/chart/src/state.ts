import type { Config, State } from "./types";

import { buildVariants, resolveChartDefaults } from "./util";

/**
 * Builds the initial state container from config defaults. The result is a
 * plain object. Wrap it in a reactive proxy to track reads and writes. The
 * active selection resolves from the first declared variant.
 */
export const createChartState = <T>(config: Config<T>): State<T> => ({
  initialized: false,
  loading: false,
  variantData: null,
  ...resolveChartDefaults(buildVariants(config)),
});
