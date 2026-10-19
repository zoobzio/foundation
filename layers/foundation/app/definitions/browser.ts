import type { Config } from "../types/data/browser";
import type { BrowserWidgetProps } from "../types/data/browser/widget";
import type { Stamp } from "../types/definition";

/**
 * The static description of a browser — one flat serializable record: the
 * domain config plus the passthrough base. Everything functional — fetch,
 * action handlers, reactive pt — attaches at `useBrowser`. Declared through
 * an entity's `defineBrowser`, which checks every field against the entity
 * type on the line it is written and captures the action-record keys for
 * the wiring to key against.
 */
export type BrowserDefinition<T> = Config<T> &
  Stamp<T> & {
    pt?: BrowserWidgetProps<T>["pt"];
  };
