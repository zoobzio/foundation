import type { DropdownMenuRootProps, DropdownMenuRootEmits, DropdownMenuContentProps, DropdownMenuContentEmits, DropdownMenuItemProps, DropdownMenuItemEmits, DropdownMenuSeparatorProps } from "reka-ui";

export type MenuItem = {
  icon?: IconAlias;
  label: string;
  disabled?: boolean;
};

export type MenuGroup = {
  key: string;
  label?: string;
  items: MenuItem[];
};

export type MenuPassthrough = {
  root?: Passthrough<DropdownMenuRootProps, DropdownMenuRootEmits>;
  content?: Passthrough<DropdownMenuContentProps, DropdownMenuContentEmits>;
  groupLabel?: Passthrough<CaptionProps>;
  item?: Passthrough<DropdownMenuItemProps, DropdownMenuItemEmits>;
  itemIcon?: Passthrough<IconProps>;
  itemLabel?: Passthrough<SpanProps>;
  separator?: Passthrough<DropdownMenuSeparatorProps>;
};

export type MenuProps = {
  open?: boolean;
  groups: MenuGroup[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  pt?: MenuPassthrough;
};

export type MenuEmits = {
  select: [item: MenuItem];
  "update:open": [value: boolean];
};

export type MenuRecipe = Recipe<MenuProps, MenuEmits>;
