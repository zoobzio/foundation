export type ColorModePassthrough = {
  tooltip?: Passthrough<TooltipProps>;
  fab?: Passthrough<FabProps>;
};

export type ColorModeProps = {
  pt?: ColorModePassthrough;
};

export type ColorModeEmits = {};

export const defineColorMode = useComponentRecipe<ColorModeProps, ColorModeEmits>();

export type ColorModeRecipe = ComponentRecipe<ColorModeProps, ColorModeEmits>;
