export type PopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  arrow?: boolean;
  tokens?: Tokens<
    "popover-trigger" | "popover-content" | "popover-arrow" | "popover-close"
  >;
};

export type PopoverEmits = {
  "update:open": [value: boolean];
};

export const definePopover = useComponentRecipe<PopoverProps, PopoverEmits>();
