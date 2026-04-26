import type { RadioGroupRootProps, RadioGroupRootEmits, RadioGroupItemProps, RadioGroupItemEmits, RadioGroupIndicatorProps } from "reka-ui";

export type RadioPassthrough = {
  root?: Passthrough<RadioGroupRootProps, RadioGroupRootEmits>;
  option?: Passthrough<LabelProps>;
  item?: Passthrough<RadioGroupItemProps, RadioGroupItemEmits>;
  indicator?: Passthrough<RadioGroupIndicatorProps>;
  optionLabel?: Passthrough<SpanProps>;
};

export type RadioProps = {
  modelValue?: string;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: "horizontal" | "vertical";
  pt?: RadioPassthrough;
};

export type RadioEmits = {
  "update:modelValue": [value: string];
};

export type RadioRecipe = Recipe<RadioProps, RadioEmits>;
