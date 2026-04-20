import type { ToggleGroupRootProps, ToggleGroupItemProps } from "reka-ui";

export type SegmentedControlPassthrough = {
  root?: Passthrough<ToggleGroupRootProps>;
  item?: Passthrough<ToggleGroupItemProps>;
};

export type SegmentedControlProps = {
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  pt?: SegmentedControlPassthrough;
};

export type SegmentedControlEmits = {} & MouseEvents & FocusEvents;

export const defineSegmentedControl = useComponentRecipe<SegmentedControlProps, SegmentedControlEmits>();

export type SegmentedControlRecipe = ComponentRecipe<SegmentedControlProps, SegmentedControlEmits>;
