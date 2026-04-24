import type { ToggleGroupRootProps, ToggleGroupRootEmits, ToggleGroupItemProps } from "reka-ui";

export type SegmentedControlPassthrough = {
  root?: Passthrough<ToggleGroupRootProps, ToggleGroupRootEmits>;
  item?: Passthrough<ToggleGroupItemProps>;
};

export type SegmentedControlProps = {
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  pt?: SegmentedControlPassthrough;
};

export type SegmentedControlEmits = {};

export const defineSegmentedControl = defineComponentRecipe<SegmentedControlProps, SegmentedControlEmits>();

export type SegmentedControlRecipe = Recipe<SegmentedControlProps, SegmentedControlEmits>;
