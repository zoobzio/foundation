export type StrongProps = {
  tokens?: Tokens<"strong">;
};

export type StrongEmits = {};

export const defineStrong = useComponentRecipe<StrongProps, StrongEmits>();
