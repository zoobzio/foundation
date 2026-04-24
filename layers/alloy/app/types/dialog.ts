import type { DialogContentProps, DialogContentEmits, DialogOverlayProps, DialogTitleProps, DialogDescriptionProps } from "reka-ui";

export type DialogPassthrough = {
  overlay?: Passthrough<DialogOverlayProps>;
  content?: Passthrough<DialogContentProps, DialogContentEmits>;
  title?: Passthrough<DialogTitleProps>;
  description?: Passthrough<DialogDescriptionProps>;
};

export type DialogProps = {
  title: string;
  description: string;
  open?: boolean;
  pt?: DialogPassthrough;
};

export type DialogEmits = {
  "update:open": [value: boolean];
};

export const defineDialog = defineComponentRecipe<DialogProps, DialogEmits>();

export type DialogRecipe = Recipe<DialogProps, DialogEmits>;
