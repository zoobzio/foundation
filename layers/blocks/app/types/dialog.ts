import type { dialog } from "../../elements.config";

export type DialogProps = {
  title: string;
  description: string;
  open?: boolean;
  tokens?: Tokens<
    typeof dialog.overlay | typeof dialog.content | typeof dialog.title | typeof dialog.description
  >;
};

export type DialogEmits = {
  "update:open": [value: boolean];
};

export const defineDialog = useComponentRecipe<DialogProps, DialogEmits>();
