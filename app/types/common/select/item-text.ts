import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { SelectItemTextProps as RekaSelectItemTextProps } from "reka-ui";

export type SelectItemTextForward = Reshape<RekaSelectItemTextProps>;

export type SelectItemTextProps = RekaSelectItemTextProps & {
  modifiers?: ModifierProps<"select-item-text">;
  tokens?: TokenProps<"select-item-text">;
  aria?: AriaProps<"select-item-text">;
};

export type SelectItemTextEmits = {};

export type SelectItemTextBindings = Bindings<"select-item-text", SelectItemTextForward>;

export type SelectItemTextContext = Reshape<SelectItemTextProps> & {
  bindings: SelectItemTextBindings;
  el: ComponentPublicInstance | null;
};

export type SelectItemTextSlots = {
  default(props: SelectItemTextContext): VNode[];
};
