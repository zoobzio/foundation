import type { label } from "../../elements.config";

export type FormLabelProps = {
  for?: string;
  tokens?: Tokens<typeof label.key>;
};

export type FormLabelEmits = {};

export const defineFormLabel = useComponentRecipe<FormLabelProps, FormLabelEmits>();
