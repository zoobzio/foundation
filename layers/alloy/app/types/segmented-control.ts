import type { ToggleGroupRootProps, ToggleGroupRootEmits, ToggleGroupItemProps } from "reka-ui";

export type SegmentedControlPassthrough = {
  root?: Passthrough<ToggleGroupRootProps, ToggleGroupRootEmits>;
  item?: Passthrough<ToggleGroupItemProps>;
  itemIcon?: Passthrough<IconProps>;
  itemLabel?: Passthrough<SpanProps>;
};

export type SegmentedControlProps = {
  modelValue?: string;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  pt?: SegmentedControlPassthrough;
};

export type SegmentedControlEmits = {
  "update:modelValue": [value: string];
};

export type SegmentedControlRecipe = Recipe<SegmentedControlProps, SegmentedControlEmits>;
