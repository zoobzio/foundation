import type { ServicesOf, Wiring } from "../types/definition";
import type { Panel, Region, Regions } from "../types/system/panel";
import type { AnyWidget, Widgets } from "../types/widget";

import { rekey } from "objectively";
import { useWiring } from "./widgets";

/**
 * Assembles a live panel from instanced widgets in the calling scope: the
 * user maps each region's definition to its feature composable, and hands
 * the results here keyed by region. Registers wiring on the hooks backbone
 * (torn down with the scope — call in setup) and returns the handle the
 * component renders. Wiring lives here, not on the definition, so handlers
 * may close over setup scope — other panels' services, stores, the router.
 * The guard maps any key outside the region vocabulary to `never` so a
 * stray key errors on the line it is written. The services record is the
 * page's typed imperative access to the machines; its exact-shape assembly
 * rides `rekey`, keyed like the registry.
 */
export const usePanel = <R extends Widgets & Regions>(
  widgets: R & { [K in Exclude<keyof R, Region>]: never },
  wire?: Wiring<R>,
): Panel<R> => {
  useWiring(wire, widgets);

  const services = rekey<Record<string, AnyWidget>, ServicesOf<R>>(
    widgets,
    (key, widget) => [key, widget.service],
  );

  return { widgets, services };
};
