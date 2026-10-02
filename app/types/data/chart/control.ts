import type { FabProps, FabEmits } from "../../core/fab";
import type { MenuProps, MenuEmits, MenuItem } from "../../core/menu";
import type { Passthrough, PT } from "../../passthrough";
import type { Service } from "../chart";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * Which machine dimension a toolbar selector drives. `useChartControl` maps
 * the picked option's value back to the matching `set*` method by this key.
 */
export type ChartControlKind =
  | "variant"
  | "field"
  | "groupBy"
  | "x"
  | "y"
  | "bucket"
  | "renderer";

export type ChartControlOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

/**
 * The selector's trigger surface: the variant selector shows the chart title
 * as text; every other selector is a fab whose label is its visible text
 * until the consumer fills the `controlIcon` slot.
 */
export type ChartControlTrigger =
  | { type: "title"; label: string }
  | { type: "fab"; label: string };

/**
 * A toolbar selector's render position: which dimension it drives, where it
 * sits, its options, and how its trigger renders. The widget's `control`
 * passthrough entry iterates over this.
 */
export type ChartControlAnchor = {
  kind: ChartControlKind;
  align: "start" | "end";
  options: ChartControlOption[];
  trigger: ChartControlTrigger;
};

export type ChartControlPassthrough = {
  menu: Passthrough<MenuProps, MenuEmits>;
  fab: Passthrough<FabProps, FabEmits>;
};

export type ChartControlProps<T> = ChartControlAnchor & {
  chart: Service<T>;
  pt?: PT<ChartControlPassthrough>;
};

export type ChartControlContext<T> = ChartControlAnchor & {
  chart: Service<T>;
  el: ComponentPublicInstance | null;
  settings: ChartControlPassthrough;
};

/**
 * `controlTitleIcon` sits after the title trigger's text; `controlIcon`
 * fills the fab trigger (switch on `kind` to pick per selector);
 * `controlOptionIcon` renders before each option in the menu.
 */
export type ChartControlSlots<T> = {
  controlTitleIcon?: (props: ChartControlContext<T>) => VNode[];
  controlIcon?: (props: ChartControlContext<T>) => VNode[];
  controlOptionIcon?: (
    props: ChartControlContext<T> & { item: MenuItem },
  ) => VNode[];
};
