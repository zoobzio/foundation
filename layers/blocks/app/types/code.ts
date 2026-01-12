export type CodeProps = {
  tokens?: Tokens<"code">;
};

export type CodeEmits = {};

export const defineCode = useComponentRecipe<CodeProps, CodeEmits>();
