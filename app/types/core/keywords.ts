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
import type { Passthrough, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type KeywordsMatchMode = "and" | "or";

export type KeywordsPassthrough = {
  popover: Passthrough<PopoverProps, PopoverEmits>;
  trigger: Passthrough<FabProps>;
  includeInput: Passthrough<TagsInputProps, TagsInputEmits>;
  excludeInput: Passthrough<TagsInputProps, TagsInputEmits>;
  matchControl: Passthrough<SegmentedControlProps, SegmentedControlEmits>;
};

export type KeywordsProps = {
  modelValue?: string;
  open?: boolean;
  pt?: PT<KeywordsPassthrough>;
};

export type KeywordsEmits = {
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
