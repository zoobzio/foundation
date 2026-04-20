export type ThemePassthrough = {
  popover?: Passthrough<PopoverProps>;
  tooltip?: Passthrough<TooltipProps>;
  fab?: Passthrough<FabProps>;
  command?: Passthrough<CommandProps>;
};

export type ThemeProps = {
  pt?: ThemePassthrough;
};

export type ThemeEmits = {};

export const defineTheme = useComponentRecipe<ThemeProps, ThemeEmits>();

export type ThemeRecipe = ComponentRecipe<ThemeProps, ThemeEmits>;
