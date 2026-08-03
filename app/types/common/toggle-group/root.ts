import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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

export type ToggleGroupRootEmits = RekaToggleGroupRootEmits & ComponentEvents["toggle-group-root"];

export type ToggleGroupRootBindings = Bindings<"toggle-group-root", ToggleGroupRootForward>;

export type ToggleGroupRootContext = Reshape<ToggleGroupRootProps, "modelValue"> & {
  modelValue: Ref<AcceptableValue | AcceptableValue[] | undefined>;
  bindings: ToggleGroupRootBindings;
  el: ComponentPublicInstance | null;
};

export type ToggleGroupRootSlots = {
  default(props: ToggleGroupRootContext): VNode[];
};
