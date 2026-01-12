export type BlockquoteProps = {
  tokens?: Tokens<"blockquote">;
};

export type BlockquoteEmits = {};

export const defineBlockquote = useComponentRecipe<BlockquoteProps, BlockquoteEmits>();
