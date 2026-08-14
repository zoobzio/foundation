import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  AcceptableValue,
  ToggleGroupRootEmits as RekaToggleGroupRootEmits,
  ToggleGroupRootProps as RekaToggleGroupRootProps,
} from "reka-ui";

export type ToggleGroupRootForward = Reshape<RekaToggleGroupRootProps, "modelValue">;

export type ToggleGroupRootProps = RekaToggleGroupRootProps & {
  modifiers?: ModifierProps<"toggle-group-root">;
  tokens?: TokenProps<"toggle-group-root">;
  aria?: AriaProps<"toggle-group-root">;
};

export type ToggleGroupRootEmits = RekaToggleGroupRootEmits & {};

export type ToggleGroupRootBindings = Bindings<"toggle-group-root", ToggleGroupRootForward>;

export type ToggleGroupRootContext = Reshape<ToggleGroupRootProps, "modelValue"> & {
  modelValue: Ref<AcceptableValue | AcceptableValue[] | undefined>;
  bindings: ToggleGroupRootBindings;
  el: ComponentPublicInstance | null;
};

export type ToggleGroupRootSlots = {
  default(props: ToggleGroupRootContext): VNode[];
};
