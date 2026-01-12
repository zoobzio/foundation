export type HrProps = {
  tokens?: Tokens<"hr">;
};

export type HrEmits = {};

export const defineHr = useComponentRecipe<HrProps, HrEmits>();
