import type { CaptionProps } from "#foundation/types/common/caption";
import type { GroupProps } from "#foundation/types/common/group";
import type { FabProps } from "#foundation/types/core/fab";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { PopoverEmits, PopoverProps } from "#foundation/types/core/popover";
import type { Recipe } from "#foundation/types/core/recipe";
import type { SegmentedControlEmits, SegmentedControlProps } from "#foundation/types/core/segmented-control";
import type { TagsInputEmits, TagsInputProps } from "#foundation/types/core/tags-input";
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
