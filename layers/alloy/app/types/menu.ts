import type { DropdownMenuContentProps } from "reka-ui";

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
  content?: Passthrough<DropdownMenuContentProps>;
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

export const defineMenu = useComponentRecipe<MenuProps, MenuEmits>();

export type MenuRecipe = ComponentRecipe<MenuProps, MenuEmits>;
