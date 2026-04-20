import type { DialogContentProps, DialogOverlayProps, DialogTitleProps, DialogDescriptionProps } from "reka-ui";

export type DialogPassthrough = {
  overlay?: Passthrough<DialogOverlayProps>;
  content?: Passthrough<DialogContentProps>;
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

export const defineDialog = useComponentRecipe<DialogProps, DialogEmits>();

export type DialogRecipe = ComponentRecipe<DialogProps, DialogEmits>;
