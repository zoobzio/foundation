import type { checkbox } from "../../elements.config";

export type CheckboxProps = {
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  tokens?: Tokens<typeof checkbox.root | typeof checkbox.indicator>;
};

export type CheckboxEmits = {};

export const defineCheckbox = useComponentRecipe<
  CheckboxProps,
  CheckboxEmits & FocusEvents
>();
