import type { select } from "../../elements.config";

export type SelectProps = {
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  tokens?: Tokens<
    | typeof select.root
    | typeof select.trigger
    | typeof select.content
    | typeof select.item
  >;
};

export type SelectEmits = {};

export const defineSelect = useComponentRecipe<
  SelectProps,
  SelectEmits & FocusEvents
>();
