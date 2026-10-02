import type {
  RadioGroupRootProps,
  RadioGroupRootEmits,
  RadioGroupItemProps,
  RadioGroupItemEmits,
  RadioGroupIndicatorProps,
} from "reka-ui";
import type { Option } from "./common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type RadioPassthrough<T extends Option = Option> = {
  root: Passthrough<RadioGroupRootProps, RadioGroupRootEmits>;
  item: PassthroughIter<T, RadioGroupItemProps, RadioGroupItemEmits>;
  indicator: Passthrough<RadioGroupIndicatorProps>;
};

export type RadioProps<T extends Option = Option> = {
  modelValue?: string;
  options: T[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: "horizontal" | "vertical";
  pt?: PT<RadioPassthrough<T>>;
};

export type RadioEmits = {
  "update:modelValue": [value: string];
};

export type RadioContext<T extends Option = Option> = {
  options: T[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation: "horizontal" | "vertical";
  modelValue: Ref<string | undefined>;
  el: ComponentPublicInstance | null;
  settings: RadioPassthrough<T>;
};

export type RadioSlots<T extends Option = Option> = {
  option?: (props: RadioContext<T> & { option: T }) => VNode[];
  indicator?: (props: RadioContext<T> & { option: T }) => VNode[];
  optionLabel?: (props: RadioContext<T> & { option: T }) => VNode[];
};
