export type CheckboxProps = {
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  tokens?: Tokens<"checkbox-root" | "checkbox-indicator">;
};

export type CheckboxEmits = {};

export const defineCheckbox = useComponentRecipe<
  CheckboxProps,
  CheckboxEmits & FocusEvents
>();
