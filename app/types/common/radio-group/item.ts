import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  RadioGroupItemEmits as RekaRadioGroupItemEmits,
  RadioGroupItemProps as RekaRadioGroupItemProps,
} from "reka-ui";

export type RadioGroupItemForward = Reshape<RekaRadioGroupItemProps>;

export type RadioGroupItemProps = RekaRadioGroupItemProps & {
  modifiers?: ModifierProps<"radio-group-item">;
  tokens?: TokenProps<"radio-group-item">;
  aria?: AriaProps<"radio-group-item">;
};

export type RadioGroupItemEmits = RekaRadioGroupItemEmits & ComponentEvents["radio-group-item"];

export type RadioGroupItemBindings = Bindings<"radio-group-item", RadioGroupItemForward>;

export type RadioGroupItemContext = Reshape<RadioGroupItemProps> & {
  bindings: RadioGroupItemBindings;
  el: ComponentPublicInstance | null;
};

export type RadioGroupItemSlots = {
  default(props: RadioGroupItemContext): VNode[];
};
