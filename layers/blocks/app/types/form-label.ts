export type FormLabelProps = {
  for?: string;
  tokens?: Tokens<"label">;
};

export type FormLabelEmits = {};

export const defineFormLabel = useComponentRecipe<FormLabelProps, FormLabelEmits>();
