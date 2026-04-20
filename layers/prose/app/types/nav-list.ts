export type NavListItem = {
  label: string;
  to?: string;
  icon?: IconAlias;
  children?: NavListItem[];
};

export type NavListGroup = {
  label: string;
  icon?: IconAlias;
  items: NavListItem[];
};

export type NavListPassthrough = {};

export type NavListProps = {
  groups: NavListGroup[];
  pt?: NavListPassthrough;
};

export type NavListEmits = {};

export const defineNavList = useComponentRecipe<NavListProps, NavListEmits>();

export type NavListRecipe = ComponentRecipe<NavListProps, NavListEmits>;
