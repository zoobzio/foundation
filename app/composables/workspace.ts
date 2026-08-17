import type { ServicesOf, Wiring } from "../types/definition";
import type {
  Workspace,
  WorkspaceDefinition,
} from "../types/system/workspace";
import type { AnyWidget, Widgets } from "../types/widget";

import { rekey } from "objectively";
import { useWiring } from "./widgets";

/**
 * Assembles a live workspace from instanced widgets in the calling scope:
 * the user maps each slot's definition to its feature composable and hands
 * the results here keyed by slot id. The definition supplies the id
 * vocabulary — the guard maps any widget key outside it to `never` so a
 * stray key errors on the line it is written — and rides the handle as the
 * layout the component renders. Registers wiring on the hooks backbone
 * (torn down with the scope — call in setup), so handlers may close over
 * setup scope. The services record is the page's typed imperative access
 * to the machines; its exact-shape assembly rides `rekey`, keyed like the
 * registry.
 */
export const useWorkspace = <D extends WorkspaceDefinition, R extends Widgets>(
  definition: D,
  widgets: R & { [K in Exclude<keyof R, keyof D["slots"]>]: never },
  wire?: Wiring<R>,
): Workspace<R> => {
  useWiring(wire, widgets);

  const services = rekey<Record<string, AnyWidget>, ServicesOf<R>>(
    widgets,
    (key, widget) => [key, widget.service],
  );

  return { layout: definition, widgets, services };
};
