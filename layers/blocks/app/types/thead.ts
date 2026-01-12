export type TheadProps = {
  tokens?: Tokens<"thead">;
};

export type TheadEmits = {};

export const defineThead = useComponentRecipe<TheadProps, TheadEmits>();
