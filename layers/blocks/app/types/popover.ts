import type { popover } from "../../elements.config";

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
    typeof popover.trigger | typeof popover.content | typeof popover.arrow | typeof popover.close
  >;
};

export type PopoverEmits = {
  "update:open": [value: boolean];
};

export const definePopover = useComponentRecipe<PopoverProps, PopoverEmits>();
