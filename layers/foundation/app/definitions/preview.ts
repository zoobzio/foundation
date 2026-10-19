import type { Config } from "../types/data/preview";
import type { PreviewWidgetProps } from "../types/data/preview/widget";
import type { Stamp } from "../types/definition";

/**
 * The static description of a preview — one flat serializable record: the
 * domain config plus the passthrough base. Everything functional — fetch,
 * reactive pt — attaches at `usePreview`. Declared through an entity's
 * `definePreview`, which checks every field against the entity type on the
 * line it is written.
 */
export type PreviewDefinition<T> = Config<T> &
  Stamp<T> & {
    pt?: PreviewWidgetProps<T>["pt"];
  };
