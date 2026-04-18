export type ImgProps = {
  src: string;
  alt?: string;};

export type ImgEmits = {};

export const defineImg = useComponentRecipe<ImgProps, ImgEmits>();

export type ImgRecipe = ComponentRecipe<ImgProps, ImgEmits>;
