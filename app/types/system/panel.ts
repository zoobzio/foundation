import type { GroupProps } from "../common/group";
import type { Passthrough, PT } from "../passthrough";
import type { ServicesOf } from "../definition";
import type { AnyWidget, Widgets } from "../widget";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * The panel's arrangement vocabulary: three fixed regions. How the regions
 * are laid out (stacked, docked, sized) is userland styling — the panel is
 * only the container.
 */
export type Region = "header" | "content" | "footer";

/**
 * The panel's static configuration shape: widget definitions keyed by the
 * region they fill. `definePanel` guards the key vocabulary only — a value's
 * fit is checked where the user maps it to its feature composable, on the
 * `use*` line that instances it. Pure data, storable in a constant.
 */
export type PanelDefinition = Partial<Record<Region, unknown>>;

/**
 * The panel's live registry shape: instanced widgets keyed by the region
 * they fill — the region name is the registry key, so wiring and `widget:`
 * slots address widgets by region. Always intersected with `Widgets` in
 * constraints: `Regions` pins the key vocabulary, `Widgets` keeps the
 * registry machinery satisfied. Unfilled regions render through their Vue
 * slot only; a region with neither is omitted from the DOM.
 */
export type Regions = Partial<Record<Region, AnyWidget>>;

/**
 * The live panel — what `usePanel` returns and the component renders: the
 * region-keyed registry at full type, and the typed services record for
 * imperative page access. Fully typed end to end; the component widens
 * `widgets` to the erased record on its render path.
 */
export type Panel<R extends Widgets & Regions> = {
  widgets: R;
  services: ServicesOf<R>;
};

export type PanelPassthrough = {
  root: Passthrough<GroupProps>;
  header: Passthrough<GroupProps>;
  content: Passthrough<GroupProps>;
  footer: Passthrough<GroupProps>;
};

export type PanelProps<R extends Widgets & Regions> = {
  panel: Panel<R>;
  pt?: PT<PanelPassthrough>;
};

export type PanelContext<R extends Widgets & Regions> = {
  panel: Panel<R>;
  el: ComponentPublicInstance | null;
  settings: PanelPassthrough;
};

export type PanelRegionContext<R extends Widgets & Regions> =
  PanelContext<R> & {
    region: Region;
  };

/**
 * Regions are addressed two ways: the region's own named slot overrides it
 * wholesale, `widget:<region>` overrides how the region's widget renders
 * and receives its typed service.
 */
export type PanelSlots<R extends Widgets & Regions> = {
  [K in Region]?: (props: PanelRegionContext<R>) => VNode[];
} & {
  [K in keyof R as `widget:${K & string}`]?: (
    props: PanelRegionContext<R> & { service: R[K]["service"] },
  ) => VNode[];
};
