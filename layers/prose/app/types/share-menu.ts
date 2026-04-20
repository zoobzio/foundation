export type ShareMenuPassthrough = {};

export type ShareMenuProps = {
  title?: string;
  url?: string;
  pt?: ShareMenuPassthrough;
};

export type ShareMenuEmits = {};

export const defineShareMenu = useComponentRecipe<ShareMenuProps, ShareMenuEmits>();

export type ShareMenuRecipe = ComponentRecipe<ShareMenuProps, ShareMenuEmits>;
