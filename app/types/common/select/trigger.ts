import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { SelectTriggerProps as RekaSelectTriggerProps } from "reka-ui";

export type SelectTriggerForward = Reshape<RekaSelectTriggerProps>;

export type SelectTriggerProps = RekaSelectTriggerProps & {
  modifiers?: ModifierProps<"select-trigger">;
  tokens?: TokenProps<"select-trigger">;
  aria?: AriaProps<"select-trigger">;
};

export type SelectTriggerEmits = EventEmits<"click">;

export type SelectTriggerBindings = Bindings<"select-trigger", SelectTriggerForward>;

export type SelectTriggerContext = Reshape<SelectTriggerProps> & {
  bindings: SelectTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type SelectTriggerSlots = {
  default(props: SelectTriggerContext): VNode[];
};
