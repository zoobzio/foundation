export type CaptionProps = {
  icon?: IconAlias;
  tokens?: Tokens<"caption">;
};

export type CaptionEmits = {};

export const defineCaption = useComponentRecipe<CaptionProps, CaptionEmits>();
