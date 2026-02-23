export type FabProps = {
  icon?: IconAlias;
  label?: string;
  type?: "button" | "submit" | "reset";
  link?: Link;
  disabled?: boolean;
  shortcut?: ButtonShortcut;
  badge?: number | string;
};

export type FabEmits = {};

export const defineFab = useComponentRecipe<
  FabProps,
  FabEmits & MouseEvents & FocusEvents
>();
