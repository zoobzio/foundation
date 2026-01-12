export type OlProps = {
  tokens?: Tokens<"ol">;
};

export type OlEmits = {};

export const defineOl = useComponentRecipe<OlProps, OlEmits>();
