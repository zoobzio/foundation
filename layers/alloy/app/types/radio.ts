import type { RadioGroupRootProps, RadioGroupItemProps, RadioGroupIndicatorProps } from "reka-ui";

export type RadioPassthrough = {
  root?: Passthrough<RadioGroupRootProps>;
  option?: Passthrough<LabelProps>;
  item?: Passthrough<RadioGroupItemProps>;
  indicator?: Passthrough<RadioGroupIndicatorProps>;
};

export type RadioProps = {
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: "horizontal" | "vertical";
  pt?: RadioPassthrough;
};

export type RadioEmits = {} & MouseEvents & FocusEvents;

export const defineRadio = useComponentRecipe<RadioProps, RadioEmits>();

export type RadioRecipe = ComponentRecipe<RadioProps, RadioEmits>;
