export type DialogProps = {
  title: string;
  description: string;
  open?: boolean;
  tokens?: Tokens<
    "dialog-overlay" | "dialog-content" | "dialog-title" | "dialog-description"
  >;
};

export type DialogEmits = {
  "update:open": [value: boolean];
};

export const defineDialog = useComponentRecipe<DialogProps, DialogEmits>();
