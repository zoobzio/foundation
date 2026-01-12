export type PreProps = {
  tokens?: Tokens<"pre">;
};

export type PreEmits = {};

export const definePre = useComponentRecipe<PreProps, PreEmits>();
