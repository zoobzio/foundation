import type { PanelDefinition } from "#foundation/types/system/panel";
import type { Widgets } from "#foundation/types/widget";

export type { PanelDefinition };

/**
 * Declares a panel at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: `R` infers from `widgets`,
 * `regions` assignments and `wire` handlers check against it on the lines
 * they are written.
 */
export const definePanel = <R extends Widgets>(
  definition: PanelDefinition<R>,
): PanelDefinition<R> => definition;
