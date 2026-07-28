import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { SelectTriggerProps as RekaSelectTriggerProps } from "reka-ui";

export type SelectTriggerForward = Reshape<RekaSelectTriggerProps>;

export type SelectTriggerProps = RekaSelectTriggerProps & {
  modifiers?: ModifierProps<"select-trigger">;
  tokens?: TokenProps<"select-trigger">;
  aria?: AriaProps<"select-trigger">;
};

export type SelectTriggerEmits = ComponentEvents["select-trigger"];

export type SelectTriggerBindings = Bindings<"select-trigger", SelectTriggerForward>;

export type SelectTriggerContext = Reshape<SelectTriggerProps> & {
  bindings: SelectTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type SelectTriggerSlots = {
  default(props: SelectTriggerContext): VNode[];
};
