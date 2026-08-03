import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  CheckboxRootEmits as RekaCheckboxRootEmits,
  CheckboxRootProps as RekaCheckboxRootProps,
} from "reka-ui";

export type CheckboxRootForward = Reshape<RekaCheckboxRootProps, "modelValue">;

export type CheckboxRootProps = RekaCheckboxRootProps & {
  modifiers?: ModifierProps<"checkbox-root">;
  tokens?: TokenProps<"checkbox-root">;
  aria?: AriaProps<"checkbox-root">;
};

export type CheckboxRootEmits = RekaCheckboxRootEmits & ComponentEvents["checkbox-root"];

export type CheckboxRootBindings = Bindings<
  "checkbox-root",
  CheckboxRootForward
>;

export type CheckboxRootContext = Reshape<CheckboxRootProps, "modelValue"> & {
  modelValue: Ref<boolean | "indeterminate" | undefined>;
  bindings: CheckboxRootBindings;
  el: ComponentPublicInstance | null;
};

export type CheckboxRootSlots = {
  default(props: CheckboxRootContext): VNode[];
};
