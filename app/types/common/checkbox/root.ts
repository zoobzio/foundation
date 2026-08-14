import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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

export type CheckboxRootEmits = RekaCheckboxRootEmits & EventEmits<"click">;

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
