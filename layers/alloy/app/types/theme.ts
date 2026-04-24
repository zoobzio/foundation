export type ThemePassthrough = {
  popover?: Passthrough<PopoverProps>;
  tooltip?: Passthrough<TooltipProps>;
  fab?: Passthrough<FabProps>;
  command?: Passthrough<CommandProps, CommandEmits>;
};

export type ThemeProps = {
  pt?: ThemePassthrough;
};

export type ThemeEmits = {};

export const defineTheme = defineComponentRecipe<ThemeProps, ThemeEmits>();

export type ThemeRecipe = Recipe<ThemeProps, ThemeEmits>;
