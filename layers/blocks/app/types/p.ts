export type PProps = {
  tokens?: Tokens<"p">;
};

export type PEmits = {};

export const defineP = useComponentRecipe<PProps, PEmits>();
