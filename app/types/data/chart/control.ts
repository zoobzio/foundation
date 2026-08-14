import type { ButtonProps, ButtonEmits } from "../../common/button";
import type { IconProps } from "../../common/icon";
import type { IconAlias } from "../../common/iconic";
import type { FabProps, FabEmits } from "../../core/fab";
import type { MenuProps, MenuEmits } from "../../core/menu";
import type { Passthrough, PT } from "../../passthrough";
import type { Service } from "../chart";
import type { ComponentPublicInstance } from "vue";

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
  icon?: IconAlias;
  disabled?: boolean;
};

/**
 * The selector's trigger surface: the variant selector shows the chart title
 * as text with a chevron; every other selector is an icon fab.
 */
export type ChartControlTrigger =
  | { type: "title"; label: string }
  | { type: "fab"; icon: IconAlias; label?: string };

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
  trigger: Passthrough<ButtonProps, ButtonEmits>;
  chevron: Passthrough<IconProps>;
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
