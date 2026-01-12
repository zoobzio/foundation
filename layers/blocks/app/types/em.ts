export type EmProps = {
  tokens?: Tokens<"em">;
};

export type EmEmits = {};

export const defineEm = useComponentRecipe<EmProps, EmEmits>();
