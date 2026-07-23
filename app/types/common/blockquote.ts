import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type BlockquoteProps = {
  label?: string;
  modifiers?: ModifierProps<"blockquote">;
  tokens?: TokenProps<"blockquote">;
  aria?: AriaProps<"blockquote">;
};

export type BlockquoteBindings = Bindings<"blockquote">;

export type BlockquoteContext = BlockquoteProps & {
  bindings: BlockquoteBindings;
  el: HTMLQuoteElement | null;
};

export type BlockquoteSlots = {
  default(props: { ctx: BlockquoteContext }): VNode[];
};
