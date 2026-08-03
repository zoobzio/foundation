import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  AcceptableValue,
  ListboxRootProps as RekaListboxRootProps,
} from "reka-ui";

export type ListboxValue = AcceptableValue | AcceptableValue[];

export type ListboxRootProps = RekaListboxRootProps;

// reka's ListboxRootEmits also carries highlight/entryFocus/leave; those fall
// through as attrs (README § behavioral elements). The root declares only the
// model emit useModel needs — widened to the array case reka's own emit type
// omits.
export type ListboxRootEmits = {
  "update:modelValue": [value: ListboxValue];
};

export type ListboxRootContext = Reshape<ListboxRootProps, "modelValue"> & {
  modelValue: Ref<ListboxValue | undefined>;
  el: ComponentPublicInstance | null;
};

export type ListboxRootSlots = {
  default(props: ListboxRootContext): VNode[];
};
