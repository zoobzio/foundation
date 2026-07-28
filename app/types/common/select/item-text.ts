import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { SelectItemTextProps as RekaSelectItemTextProps } from "reka-ui";

export type SelectItemTextForward = Reshape<RekaSelectItemTextProps>;

export type SelectItemTextProps = RekaSelectItemTextProps & {
  modifiers?: ModifierProps<"select-item-text">;
  tokens?: TokenProps<"select-item-text">;
  aria?: AriaProps<"select-item-text">;
};

export type SelectItemTextEmits = ComponentEvents["select-item-text"];

export type SelectItemTextBindings = Bindings<"select-item-text", SelectItemTextForward>;

export type SelectItemTextContext = Reshape<SelectItemTextProps> & {
  bindings: SelectItemTextBindings;
  el: ComponentPublicInstance | null;
};

export type SelectItemTextSlots = {
  default(props: SelectItemTextContext): VNode[];
};
