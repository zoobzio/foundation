import type { PopoverContentProps, PopoverArrowProps, PopoverCloseProps } from "reka-ui";

export type PopoverPassthrough = {
  content?: Passthrough<PopoverContentProps>;
  arrow?: Passthrough<PopoverArrowProps>;
  close?: Passthrough<PopoverCloseProps>;
};

export type PopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  arrow?: boolean;
  pt?: PopoverPassthrough;
};

export type PopoverEmits = {
  "update:open": [value: boolean];
};

export const definePopover = useComponentRecipe<PopoverProps, PopoverEmits>();

export type PopoverRecipe = ComponentRecipe<PopoverProps, PopoverEmits>;
