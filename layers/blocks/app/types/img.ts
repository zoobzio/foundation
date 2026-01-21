import type { img } from "../../elements.config";

export type ImgProps = {
  src: string;
  alt?: string;
  tokens?: Tokens<typeof img.key>;
};

export type ImgEmits = {};

export const defineImg = useComponentRecipe<ImgProps, ImgEmits>();
