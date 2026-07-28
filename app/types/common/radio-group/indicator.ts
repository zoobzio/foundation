import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
