import type { CaptionProps } from "#foundation/types/common/caption";
import type { GroupProps } from "#foundation/types/common/group";
import type { FabProps } from "#foundation/types/core/fab";
import type { PopoverProps, PopoverEmits } from "#foundation/types/core/popover";
import type {
  SegmentedControlProps,
  SegmentedControlEmits,
} from "#foundation/types/core/segmented-control";
import type {
  TagsInputProps,
  TagsInputEmits,
} from "#foundation/types/core/tags-input";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type KeywordsMatchMode = "and" | "or";

export type KeywordsPassthrough = {
  popover: Passthrough<PopoverProps, PopoverEmits>;
  trigger: Passthrough<FabProps>;
  root: Passthrough<GroupProps>;
  include: Passthrough<GroupProps>;
  includeLabel: Passthrough<CaptionProps>;
  includeInput: Passthrough<TagsInputProps, TagsInputEmits>;
  exclude: Passthrough<GroupProps>;
  excludeLabel: Passthrough<CaptionProps>;
  excludeInput: Passthrough<TagsInputProps, TagsInputEmits>;
  match: Passthrough<GroupProps>;
  matchLabel: Passthrough<CaptionProps>;
  matchControl: Passthrough<SegmentedControlProps, SegmentedControlEmits>;
};

export type KeywordsProps = {
  modelValue?: string;
  open?: boolean;
  pt?: PT<KeywordsPassthrough>;
};

export type KeywordsEmits = ComponentEvents["keywords"] & {
  "update:modelValue": [value: string];
  "update:open": [value: boolean];
};

export type KeywordsContext = {
  keywords: string;
  include: string[];
  exclude: string[];
  mode: KeywordsMatchMode;
  activeCount: number;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: KeywordsPassthrough;
};

export type KeywordsSlots = {
  trigger?: (props: KeywordsContext) => VNode[];
  root?: (props: KeywordsContext) => VNode[];
  include?: (props: KeywordsContext) => VNode[];
  includeLabel?: (props: KeywordsContext) => VNode[];
  includeInput?: (props: KeywordsContext) => VNode[];
  exclude?: (props: KeywordsContext) => VNode[];
  excludeLabel?: (props: KeywordsContext) => VNode[];
  excludeInput?: (props: KeywordsContext) => VNode[];
  match?: (props: KeywordsContext) => VNode[];
  matchLabel?: (props: KeywordsContext) => VNode[];
  matchControl?: (props: KeywordsContext) => VNode[];
};
