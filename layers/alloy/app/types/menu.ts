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
  item?: Passthrough<DropdownMenuItemProps, DropdownMenuItemEmits>;
  separator?: Passthrough<DropdownMenuSeparatorProps>;
};

export type MenuProps = {
  groups: MenuGroup[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  pt?: MenuPassthrough;
};

export type MenuEmits = {
  select: [item: MenuItem];
};

export const defineMenu = defineComponentRecipe<MenuProps, MenuEmits>();

export type MenuRecipe = Recipe<MenuProps, MenuEmits>;
