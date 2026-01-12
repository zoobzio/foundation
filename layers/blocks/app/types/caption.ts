export type CaptionProps = {
  icon?: string;
  tokens?: Tokens<"caption">;
};

export type CaptionEmits = {};

export const defineCaption = useComponentRecipe<CaptionProps, CaptionEmits>();
