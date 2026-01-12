export type ArticleProps = {
  tokens?: Tokens<"article">;
};

export type ArticleEmits = {};

export const defineArticle = useComponentRecipe<ArticleProps, ArticleEmits>();
