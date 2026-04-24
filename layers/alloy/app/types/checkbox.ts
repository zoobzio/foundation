import type { CheckboxRootProps, CheckboxRootEmits } from "reka-ui";

export type CheckboxPassthrough = {
  root?: Passthrough<CheckboxRootProps, CheckboxRootEmits>;
  indicator?: Passthrough<GroupProps>;
};

export type CheckboxProps = {
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  pt?: CheckboxPassthrough;
};

export type CheckboxEmits = {
  "update:modelValue": [value: boolean | "indeterminate"];
};

export const defineCheckbox = defineComponentRecipe<CheckboxProps, CheckboxEmits>();

export type CheckboxRecipe = Recipe<CheckboxProps, CheckboxEmits>;
