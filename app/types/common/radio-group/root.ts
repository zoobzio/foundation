import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  AcceptableValue,
  RadioGroupRootEmits as RekaRadioGroupRootEmits,
  RadioGroupRootProps as RekaRadioGroupRootProps,
} from "reka-ui";

export type RadioGroupRootForward = Reshape<RekaRadioGroupRootProps, "modelValue">;

export type RadioGroupRootProps = RekaRadioGroupRootProps & {
  modifiers?: ModifierProps<"radio-group-root">;
  tokens?: TokenProps<"radio-group-root">;
  aria?: AriaProps<"radio-group-root">;
};

export type RadioGroupRootEmits = RekaRadioGroupRootEmits & {};

export type RadioGroupRootBindings = Bindings<"radio-group-root", RadioGroupRootForward>;

export type RadioGroupRootContext = Reshape<RadioGroupRootProps, "modelValue"> & {
  modelValue: Ref<AcceptableValue | undefined>;
  bindings: RadioGroupRootBindings;
  el: ComponentPublicInstance | null;
};

export type RadioGroupRootSlots = {
  default(props: RadioGroupRootContext): VNode[];
};
