import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { RadioGroupIndicatorProps as RekaRadioGroupIndicatorProps } from "reka-ui";

export type RadioGroupIndicatorForward = Reshape<RekaRadioGroupIndicatorProps>;

export type RadioGroupIndicatorProps = RekaRadioGroupIndicatorProps & {
  modifiers?: ModifierProps<"radio-group-indicator">;
  tokens?: TokenProps<"radio-group-indicator">;
  aria?: AriaProps<"radio-group-indicator">;
};

export type RadioGroupIndicatorEmits = ComponentEvents["radio-group-indicator"];

export type RadioGroupIndicatorBindings = Bindings<"radio-group-indicator", RadioGroupIndicatorForward>;

export type RadioGroupIndicatorContext = Reshape<RadioGroupIndicatorProps> & {
  bindings: RadioGroupIndicatorBindings;
  el: ComponentPublicInstance | null;
};

export type RadioGroupIndicatorSlots = {
  default(props: RadioGroupIndicatorContext): VNode[];
};
