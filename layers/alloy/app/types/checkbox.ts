import type { CheckboxRootProps, CheckboxRootEmits } from "reka-ui";

export type CheckboxPassthrough = {
  root?: Passthrough<CheckboxRootProps, CheckboxRootEmits>;
  indicator?: Passthrough<GroupProps>;
  icon?: Passthrough<IconProps>;
};

export type CheckboxProps = {
  modelValue?: boolean | "indeterminate";
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  pt?: CheckboxPassthrough;
};

export type CheckboxEmits = {
  "update:modelValue": [value: boolean | "indeterminate"];
};

export type CheckboxRecipe = Recipe<CheckboxProps, CheckboxEmits>;
