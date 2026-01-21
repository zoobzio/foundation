import type { input } from "../../elements.config";

export type InputShortcut = string;

export type InputProps = {
  type?: "text" | "email" | "password" | "search" | "url" | "tel" | "number";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  shortcut?: InputShortcut;
  tokens?: Tokens<
    | typeof input.root
    | typeof input.prepend
    | typeof input.input
    | typeof input.append
  >;
};

export type InputEmits = {};

export const defineInput = useComponentRecipe<
  InputProps,
  InputEmits & InputEvents & FocusEvents
>();
