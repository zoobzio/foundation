export type KeywordEntry = {
  mode: "include" | "exclude";
  term: string;
};

export type KeywordsPassthrough = {
  popover?: Passthrough<PopoverProps, PopoverEmits>;
  trigger?: Passthrough<FabProps>;
  root?: Passthrough<GroupProps>;
  include?: Passthrough<GroupProps>;
  includeLabel?: Passthrough<CaptionProps>;
  includeInput?: Passthrough<TagsInputProps, TagsInputEmits>;
  exclude?: Passthrough<GroupProps>;
  excludeLabel?: Passthrough<CaptionProps>;
  excludeInput?: Passthrough<TagsInputProps, TagsInputEmits>;
  match?: Passthrough<GroupProps>;
  matchLabel?: Passthrough<CaptionProps>;
  matchControl?: Passthrough<SegmentedControlProps, SegmentedControlEmits>;
};

export type KeywordsProps = {
  modelValue?: string;
  pt?: KeywordsPassthrough;
};

export type KeywordsEmits = {
  "update:modelValue": [value: string];
};

export type KeywordsRecipe = Recipe<KeywordsProps, KeywordsEmits>;
