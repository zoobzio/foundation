import type {
  RadioGroupRootProps,
  RadioGroupRootEmits,
  RadioGroupItemProps,
  RadioGroupItemEmits,
  RadioGroupIndicatorProps,
} from "reka-ui";
import type { Option } from "../common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, HTMLAttributes, Ref, VNode } from "vue";

/**
 * The parts of the radio group that accept passthrough. `root` is the
 * rendered group element, so it also takes HTML attributes: a form lays
 * its `id`, `aria-labelledby`, and `aria-describedby` there.
 */
export type RadioPassthrough<T extends Option = Option> = {
  root: Passthrough<RadioGroupRootProps & HTMLAttributes, RadioGroupRootEmits>;
  item: PassthroughIter<T, RadioGroupItemProps, RadioGroupItemEmits>;
  indicator: Passthrough<RadioGroupIndicatorProps>;
};

/**
 * Props of the radio group. `modelValue` is the selected option value.
 */
export type RadioProps<T extends Option = Option> = {
  modelValue?: string;
  options: T[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: "horizontal" | "vertical";
  pt?: PT<RadioPassthrough<T>>;
};

/**
 * Emits of the radio group.
 */
export type RadioEmits = {
  "update:modelValue": [value: string];
};

/**
 * The radio group view model, served to `defineExpose` and the slots.
 */
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

/**
 * Slots of the radio group. Each slot receives the context and the
 * `option`.
 */
export type RadioSlots<T extends Option = Option> = {
  option?: (props: RadioContext<T> & { option: T }) => VNode[];
  indicator?: (props: RadioContext<T> & { option: T }) => VNode[];
  optionLabel?: (props: RadioContext<T> & { option: T }) => VNode[];
};

/**
 * A radio group instance as data: props plus emit listeners.
 */
export type RadioDefinition<T extends Option = Option> = Definition<
  RadioProps<T>,
  RadioEmits
>;
