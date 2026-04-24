export type KeywordEntry = {
  mode: "include" | "exclude";
  term: string;
};

export type KeywordsPassthrough = {
  root?: Passthrough<GroupProps>;
  include?: Passthrough<GroupProps>;
  exclude?: Passthrough<GroupProps>;
  match?: Passthrough<GroupProps>;
  includeInput?: Passthrough<TagsInputProps>;
  excludeInput?: Passthrough<TagsInputProps>;
};

export type KeywordsProps = {
  pt?: KeywordsPassthrough;
};

export type KeywordsEmits = {};

export const defineKeywords = defineComponentRecipe<KeywordsProps, KeywordsEmits>();

export type KeywordsRecipe = Recipe<KeywordsProps, KeywordsEmits>;
