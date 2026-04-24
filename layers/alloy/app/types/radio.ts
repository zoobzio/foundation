import type { RadioGroupRootProps, RadioGroupRootEmits, RadioGroupItemProps, RadioGroupItemEmits, RadioGroupIndicatorProps } from "reka-ui";

export type RadioPassthrough = {
  root?: Passthrough<RadioGroupRootProps, RadioGroupRootEmits>;
  option?: Passthrough<LabelProps>;
  item?: Passthrough<RadioGroupItemProps, RadioGroupItemEmits>;
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

export type RadioEmits = {};

export const defineRadio = defineComponentRecipe<RadioProps, RadioEmits>();

export type RadioRecipe = Recipe<RadioProps, RadioEmits>;
