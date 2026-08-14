import type { Actions, Config } from "../types/data/chart";
import type { ChartWidgetProps } from "../types/data/chart/widget";
import type { WidgetSettings } from "../types/widget";

/**
 * The static description `createChart` instances: everything about the
 * feature except its id. Reusable — one definition, many ids, many machines.
 */
export type ChartDefinition<T> = {
  config: Config<T>;
  actions?: Actions<T>;
  settings?: WidgetSettings<ChartWidgetProps<T>>;
};

/**
 * Declares a chart at module scope — pure data plus consumer callbacks,
 * no runtime, no Vue. The identity function is the type checkpoint: the
 * generics infer from `config`, and every field errors on the line it is
 * written.
 */
export const defineChart = <T>(
  definition: ChartDefinition<T>,
): ChartDefinition<T> => definition;
