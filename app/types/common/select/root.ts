import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  AcceptableValue,
  SelectRootEmits as RekaSelectRootEmits,
  SelectRootProps as RekaSelectRootProps,
} from "reka-ui";

export type SelectRootProps = RekaSelectRootProps;

export type SelectRootEmits = RekaSelectRootEmits;

export type SelectRootContext = Reshape<SelectRootProps, "modelValue" | "open"> & {
  modelValue: Ref<AcceptableValue | undefined>;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
};

export type SelectRootSlots = {
  default(props: SelectRootContext): VNode[];
};
