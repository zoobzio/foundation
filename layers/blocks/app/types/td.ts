export type TdProps = {
  tokens?: Tokens<"td">;
};

export type TdEmits = {};

export const defineTd = useComponentRecipe<TdProps, TdEmits>();
