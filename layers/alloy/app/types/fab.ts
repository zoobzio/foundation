import type { PrimitiveProps } from "reka-ui";

export type FabPassthrough = {
  root?: Passthrough<PrimitiveProps>;
  badge?: Passthrough<GroupProps>;
};

export type FabProps = {
  icon?: IconAlias;
  label?: string;
  type?: "button" | "submit" | "reset";
  link?: Link;
  disabled?: boolean;
  shortcut?: ButtonShortcut;
  badge?: number | string;
  pt?: FabPassthrough;
};

export type FabEmits = {} & MouseEvents & FocusEvents;

export const defineFab = useComponentRecipe<FabProps, FabEmits>();

export type FabRecipe = ComponentRecipe<FabProps, FabEmits>;
