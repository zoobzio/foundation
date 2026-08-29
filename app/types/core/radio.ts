import type {
  RadioGroupRootProps,
  RadioGroupRootEmits,
  RadioGroupItemProps,
  RadioGroupItemEmits,
  RadioGroupIndicatorProps,
} from "reka-ui";
import type { Option } from "./common";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type RadioPassthrough = {
  root: Passthrough<RadioGroupRootProps, RadioGroupRootEmits>;
  item: PassthroughIter<Option, RadioGroupItemProps, RadioGroupItemEmits>;
  indicator: Passthrough<RadioGroupIndicatorProps>;
};

export type RadioProps = {
  modelValue?: string;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: "horizontal" | "vertical";
  pt?: PT<RadioPassthrough>;
};

export type RadioEmits = {
  "update:modelValue": [value: string];
};

export type RadioContext = {
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation: "horizontal" | "vertical";
  modelValue: Ref<string | undefined>;
  el: ComponentPublicInstance | null;
  settings: RadioPassthrough;
};

export type RadioSlots = {
  option?: (props: RadioContext & { option: Option }) => VNode[];
  indicator?: (props: RadioContext & { option: Option }) => VNode[];
  optionLabel?: (props: RadioContext & { option: Option }) => VNode[];
};
