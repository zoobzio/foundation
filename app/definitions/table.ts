import type { Actions, Config } from "../types/data/table";
import type { TableWidgetProps } from "../types/data/table/widget";
import type { WidgetSettings } from "../types/widget";

/**
 * The static description `createTable` instances: everything about the
 * feature except its id. Reusable — one definition, many ids, many machines.
 */
export type TableDefinition<T, K = unknown> = {
  config: Config<T, K>;
  actions: Actions<T, K>;
  settings?: WidgetSettings<TableWidgetProps<T, K>>;
};

/**
 * Declares a table at module scope — pure data plus consumer callbacks,
 * no runtime, no Vue. The identity function is the type checkpoint: the
 * generics infer from `config`, and every field errors on the line it is
 * written.
 */
export const defineTable = <T, K = unknown>(
  definition: TableDefinition<T, K>,
): TableDefinition<T, K> => definition;
