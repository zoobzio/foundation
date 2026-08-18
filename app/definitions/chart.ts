import type { Config } from "../types/data/chart";
import type { ChartWidgetProps } from "../types/data/chart/widget";
import type { Stamp } from "../types/definition";

/**
 * The static description of a chart — one flat serializable record: the
 * domain config (variant declarations, renderers, color map) plus the
 * passthrough base. Everything functional — the per-variant fetchers,
 * reactive pt — attaches at `useChart`. Declared through an entity's
 * `defineChart`, which checks every field against the entity type on the
 * line it is written and captures which variants exist for the wiring to
 * key against.
 */
export type ChartDefinition<T> = Config<T> &
  Stamp<T> & {
    pt?: ChartWidgetProps<T>["pt"];
  };
