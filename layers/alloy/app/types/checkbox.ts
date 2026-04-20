import type { CheckboxRootProps } from "reka-ui";

export type CheckboxPassthrough = {
  root?: Passthrough<CheckboxRootProps>;
  indicator?: Passthrough<GroupProps>;
};

export type CheckboxProps = {
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  pt?: CheckboxPassthrough;
};

export type CheckboxEmits = {} & MouseEvents & FocusEvents;

export const defineCheckbox = useComponentRecipe<CheckboxProps, CheckboxEmits>();

export type CheckboxRecipe = ComponentRecipe<CheckboxProps, CheckboxEmits>;
