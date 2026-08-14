import type { CaptionProps } from "../common/caption";
import type { GroupProps } from "../common/group";
import type { FabProps } from "./fab";
import type { PopoverProps, PopoverEmits } from "./popover";
import type {
  SegmentedControlProps,
  SegmentedControlEmits,
} from "./segmented-control";
import type {
  TagsInputProps,
  TagsInputEmits,
} from "./tags-input";
import type { ComponentEvents } from "../events";
import type { Passthrough, PT } from "../passthrough";
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
