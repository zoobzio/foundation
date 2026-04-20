export type FlatTocLink = {
  id: string;
  text: string;
  depth: number;
};

export type TocPassthrough = {};

export type TocProps = {
  links: TocLink[];
  title?: string;
  pt?: TocPassthrough;
};

export type TocEmits = {};

export const defineToc = useComponentRecipe<TocProps, TocEmits>();

export type TocRecipe = ComponentRecipe<TocProps, TocEmits>;
