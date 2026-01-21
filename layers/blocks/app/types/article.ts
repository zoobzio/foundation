import type { article } from "../../elements.config";

export type ArticleProps = {
  tokens?: Tokens<typeof article.key>;
};

export type ArticleEmits = {};

export const defineArticle = useComponentRecipe<ArticleProps, ArticleEmits>();
