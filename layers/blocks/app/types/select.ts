export type SelectProps = {
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  tokens?: Tokens<
    | "select-root"
    | "select-trigger"
    | "select-content"
    | "select-item"
  >;
};

export type SelectEmits = {};

export const defineSelect = useComponentRecipe<
  SelectProps,
  SelectEmits & FocusEvents
>();
