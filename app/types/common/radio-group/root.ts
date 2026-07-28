import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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

export type RadioGroupRootEmits = RekaRadioGroupRootEmits & ComponentEvents["radio-group-root"];

export type RadioGroupRootBindings = Bindings<"radio-group-root", RadioGroupRootForward>;

export type RadioGroupRootContext = Reshape<RadioGroupRootProps, "modelValue"> & {
  modelValue: Ref<AcceptableValue | undefined>;
  bindings: RadioGroupRootBindings;
  el: ComponentPublicInstance | null;
};

export type RadioGroupRootSlots = {
  default(props: RadioGroupRootContext): VNode[];
};
