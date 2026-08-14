import type { PanelSpec } from "#foundation/types/system/panel";
import type { Widgets } from "#foundation/types/widget";

export type { PanelSpec };

/**
 * Declares a panel at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: `R` infers from `widgets`,
 * `regions` assignments and `wire` handlers check against it on the lines
 * they are written.
 */
export const definePanel = <R extends Widgets>(
  spec: PanelSpec<R>,
): PanelSpec<R> => spec;
