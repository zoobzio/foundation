import type { Config } from "../types/data/table";
import type { TableWidgetProps } from "../types/data/table/widget";
import type { Stamp } from "../types/definition";

/**
 * The static description of a table — one flat serializable record: the
 * domain config plus the passthrough base. Everything functional — fetch,
 * action handlers, reactive pt — attaches at `useTable`. Declared through an
 * entity's `defineTable`, which checks every field against the entity type
 * on the line it is written and captures the action-record keys for the
 * wiring to key against.
 */
export type TableDefinition<T> = Config<T> &
  Stamp<T> & {
    pt?: TableWidgetProps<T>["pt"];
  };
