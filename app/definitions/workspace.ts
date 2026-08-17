import type { WorkspaceDefinition } from "../types/system/workspace";

/**
 * Declares a workspace at module scope — pure data, no runtime, no Vue:
 * grid geometry and id-keyed slots, each optionally carrying the widget
 * definition that fills it. The identity function is the type checkpoint:
 * `D` infers whole, so slot ids and each slot's widget definition survive
 * at full type for the `use*` lines that instance them. Interactivity
 * attaches at `useWorkspace`.
 */
export const defineWorkspace = <D extends WorkspaceDefinition>(
  definition: D,
): D => definition;
