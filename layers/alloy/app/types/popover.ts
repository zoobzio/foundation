import type { PopoverRootProps, PopoverRootEmits, PopoverAnchorProps, PopoverContentProps, PopoverContentEmits, PopoverArrowProps, PopoverCloseProps } from "reka-ui";

export type PopoverPassthrough = {
  root?: Passthrough<PopoverRootProps, PopoverRootEmits>;
  anchor?: Passthrough<PopoverAnchorProps>;
  content?: Passthrough<PopoverContentProps, PopoverContentEmits>;
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
  disabled?: boolean;
  pt?: PopoverPassthrough;
};

export type PopoverEmits = {
  "update:open": [value: boolean];
};

export type PopoverRecipe = Recipe<PopoverProps, PopoverEmits>;
