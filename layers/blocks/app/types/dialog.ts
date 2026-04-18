export type DialogProps = {
  title: string;
  description: string;
  open?: boolean;};

export type DialogEmits = {
  "update:open": [value: boolean];
};

export const defineDialog = useComponentRecipe<DialogProps, DialogEmits>();

export type DialogRecipe = ComponentRecipe<DialogProps, DialogEmits>;
