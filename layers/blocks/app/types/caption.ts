import type { caption } from "../../elements.config";

export type CaptionProps = {
  icon?: IconAlias;
  tokens?: Tokens<typeof caption.key>;
};

export type CaptionEmits = {};

export const defineCaption = useComponentRecipe<CaptionProps, CaptionEmits>();
