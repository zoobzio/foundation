export type ImgProps = {
  src: string;
  alt?: string;
  tokens?: Tokens<"img">;
};

export type ImgEmits = {};

export const defineImg = useComponentRecipe<ImgProps, ImgEmits>();
