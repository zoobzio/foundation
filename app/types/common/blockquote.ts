import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type BlockquoteProps = {
  label?: string;
  modifiers?: ModifierProps<"blockquote">;
  tokens?: TokenProps<"blockquote">;
  aria?: AriaProps<"blockquote">;
};

export type BlockquoteEmits = {};

export type BlockquoteBindings = Bindings<"blockquote">;

export type BlockquoteContext = BlockquoteProps & {
  bindings: BlockquoteBindings;
  el: HTMLQuoteElement | null;
};

export type BlockquoteSlots = {
  default(props: BlockquoteContext): VNode[];
};
