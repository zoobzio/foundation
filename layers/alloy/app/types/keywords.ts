export type KeywordEntry = {
  mode: "include" | "exclude";
  term: string;
};

export type KeywordsPassthrough = {
  root?: Passthrough<GroupProps>;
};

export type KeywordsProps = {
  pt?: KeywordsPassthrough;
};

export type KeywordsEmits = {};

export const defineKeywords = useComponentRecipe<KeywordsProps, KeywordsEmits>();

export type KeywordsRecipe = ComponentRecipe<KeywordsProps, KeywordsEmits>;
