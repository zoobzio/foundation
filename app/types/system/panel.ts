import type { GroupProps } from "../common/group";
import type { Passthrough, PT } from "../passthrough";
import type { Wiring } from "../definition";
import type { Widgets } from "../widget";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * The panel's arrangement vocabulary: three fixed regions. How the regions
 * are laid out (stacked, docked, sized) is userland styling — the panel is
 * only the container.
 */
export type Region = "header" | "content" | "footer";

/**
 * Region → registry key assignment. Unassigned regions render through their
 * Vue slot only; a region with neither is omitted from the DOM.
 */
export type Regions<R extends Widgets = Widgets> = {
  [K in Region]?: keyof R;
};

/**
 * The complete description a panel renders: what exists (`widgets`), which
 * region each fills (`regions`), how it talks to itself (`wire`). Built at
 * module scope with `definePanel` — pure data, no runtime.
 */
export type PanelDefinition<R extends Widgets> = {
  widgets: R;
  regions: Regions<R>;
  wire?: Wiring<R>;
};

export type PanelPassthrough = {
  root: Passthrough<GroupProps>;
  header: Passthrough<GroupProps>;
  content: Passthrough<GroupProps>;
  footer: Passthrough<GroupProps>;
};

export type PanelProps<R extends Widgets> = {
  definition: PanelDefinition<R>;
  pt?: PT<PanelPassthrough>;
};

export type PanelContext<R extends Widgets> = {
  definition: PanelDefinition<R>;
  el: ComponentPublicInstance | null;
  settings: PanelPassthrough;
};

export type PanelRegionContext<R extends Widgets> = PanelContext<R> & {
  region: Region;
};

/**
 * Regions are addressed two ways: the region's own named slot overrides it
 * wholesale, `widget:<key>` overrides how a registry widget renders and
 * receives its typed service.
 */
export type PanelSlots<R extends Widgets> = {
  [K in Region]?: (props: PanelRegionContext<R>) => VNode[];
} & {
  [K in keyof R as `widget:${K & string}`]?: (
    props: PanelRegionContext<R> & { service: ReturnType<R[K]>["service"] },
  ) => VNode[];
};
