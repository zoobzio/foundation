import type { WorkspaceSpec } from "#foundation/types/system/workspace";
import type { Widgets } from "#foundation/types/widget";

export type { WorkspaceSpec };

/**
 * Declares a workspace at module scope — pure data, no runtime, no Vue.
 * The identity function is the type checkpoint: `R` infers from `widgets`,
 * `layout` keys and `wire` handlers check against it on the lines they are
 * written.
 */
export const defineWorkspace = <R extends Widgets>(
  spec: WorkspaceSpec<R>,
): WorkspaceSpec<R> => spec;
