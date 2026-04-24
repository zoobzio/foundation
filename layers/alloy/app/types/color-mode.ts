export type ColorModePassthrough = {
  tooltip?: Passthrough<TooltipProps>;
  fab?: Passthrough<FabProps>;
};

export type ColorModeProps = {
  pt?: ColorModePassthrough;
};

export type ColorModeEmits = {};

export const defineColorMode = defineComponentRecipe<ColorModeProps, ColorModeEmits>();

export type ColorModeRecipe = Recipe<ColorModeProps, ColorModeEmits>;
