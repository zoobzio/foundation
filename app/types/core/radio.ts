import type { LabelProps } from "../common/label";
import type {
  RadioGroupRootProps,
  RadioGroupRootEmits,
} from "../common/radio-group/root";
import type {
  RadioGroupItemProps,
  RadioGroupItemEmits,
} from "../common/radio-group/item";
import type { RadioGroupIndicatorProps } from "../common/radio-group/indicator";
import type { SpanProps } from "../common/span";
import type { Option } from "./common";
import type { ComponentEvents } from "../events";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type RadioPassthrough = {
  root: Passthrough<RadioGroupRootProps, RadioGroupRootEmits>;
  option: Passthrough<LabelProps>;
  item: PassthroughIter<Option, RadioGroupItemProps, RadioGroupItemEmits>;
  indicator: Passthrough<RadioGroupIndicatorProps>;
  optionLabel: Passthrough<SpanProps>;
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

export type RadioEmits = ComponentEvents["radio"] & {
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
