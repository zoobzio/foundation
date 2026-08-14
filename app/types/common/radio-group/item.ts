import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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

export type RadioGroupItemEmits = RekaRadioGroupItemEmits & EventEmits<"click">;

export type RadioGroupItemBindings = Bindings<"radio-group-item", RadioGroupItemForward>;

export type RadioGroupItemContext = Reshape<RadioGroupItemProps> & {
  bindings: RadioGroupItemBindings;
  el: ComponentPublicInstance | null;
};

export type RadioGroupItemSlots = {
  default(props: RadioGroupItemContext): VNode[];
};
