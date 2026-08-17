import type { PanelDefinition, Region } from "../types/system/panel";

/**
 * Declares a panel at module scope — pure data, no runtime, no Vue: widget
 * definitions keyed by the region they fill, storable as baseline static
 * configuration. The identity function is the type checkpoint: `R` infers
 * from the record, and the guard maps any key outside the region vocabulary
 * to `never` so a stray key errors on the line it is written. Each value's
 * fit is checked downstream, where the user maps it to its feature
 * composable; the instanced widgets attach at `usePanel`.
 */
export const definePanel = <R extends PanelDefinition>(
  definition: R & { [K in Exclude<keyof R, Region>]: never },
): R => definition;
