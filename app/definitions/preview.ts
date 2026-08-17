import type { Actions, Config } from "../types/data/preview";
import type { PreviewWidgetProps } from "../types/data/preview/widget";
import type { WidgetSettings } from "../types/widget";

/**
 * The static description `usePreview` instances: everything about the
 * feature except its id. Reusable — one definition, many ids, many machines.
 */
export type PreviewDefinition<T> = {
  config: Config<T>;
  actions: Actions<T>;
  settings?: WidgetSettings<PreviewWidgetProps<T>>;
};

/**
 * Declares a preview at module scope — pure data plus consumer callbacks,
 * no runtime, no Vue. The identity function is the type checkpoint: the
 * generics infer from `config`, and every field errors on the line it is
 * written.
 */
export const definePreview = <T>(
  definition: PreviewDefinition<T>,
): PreviewDefinition<T> => definition;
