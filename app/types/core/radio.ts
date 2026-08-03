import type { LabelProps } from "#foundation/types/common/label";
import type {
  RadioGroupRootProps,
  RadioGroupRootEmits,
} from "#foundation/types/common/radio-group/root";
import type {
  RadioGroupItemProps,
  RadioGroupItemEmits,
} from "#foundation/types/common/radio-group/item";
import type { RadioGroupIndicatorProps } from "#foundation/types/common/radio-group/indicator";
import type { SpanProps } from "#foundation/types/common/span";
import type { Option } from "#foundation/types/core/common";
import type { ComponentEvents } from "#foundation/types/events";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
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
