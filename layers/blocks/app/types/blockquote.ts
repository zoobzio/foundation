import type { blockquote } from "../../elements.config";

export type BlockquoteProps = {
  tokens?: Tokens<typeof blockquote.key>;
};

export type BlockquoteEmits = {};

export const defineBlockquote = useComponentRecipe<BlockquoteProps, BlockquoteEmits>();
