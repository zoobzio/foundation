import type { FabProps } from "./fab";
import type { PopoverProps, PopoverEmits } from "./popover";
import type {
  SegmentedControlProps,
  SegmentedControlEmits,
} from "./segmented-control";
import type { TagsInputProps, TagsInputEmits } from "./tags-input";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * How include terms combine.
 */
export type KeywordsMatchMode = "and" | "or";

/**
 * The parts of the keywords that accept passthrough.
 */
export type KeywordsPassthrough = {
  popover: Passthrough<PopoverProps, PopoverEmits>;
  trigger: Passthrough<FabProps>;
  includeInput: Passthrough<TagsInputProps, TagsInputEmits>;
  excludeInput: Passthrough<TagsInputProps, TagsInputEmits>;
  matchControl: Passthrough<SegmentedControlProps, SegmentedControlEmits>;
};

/**
 * Props of the keywords. `modelValue` is the keyword expression.
 */
export type KeywordsProps = {
  modelValue?: string;
  open?: boolean;
  pt?: PT<KeywordsPassthrough>;
};

/**
 * Emits of the keywords.
 */
export type KeywordsEmits = {
  "update:modelValue": [value: string];
  "update:open": [value: boolean];
};

/**
 * The keywords view model, served to `defineExpose` and the slots. `keywords`
 * is the expression. `activeCount` is the number of terms.
 */
export type KeywordsContext = {
  keywords: string;
  include: string[];
  exclude: string[];
  mode: KeywordsMatchMode;
  activeCount: number;
  open: Ref<boolean>;
  el: ComponentPublicInstance | null;
  settings: KeywordsPassthrough;
};

/**
 * Slots of the keywords. Each slot receives the context.
 */
export type KeywordsSlots = {
  trigger?: (props: KeywordsContext) => VNode[];
  triggerIcon?: (props: KeywordsContext) => VNode[];
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

/**
 * A keywords instance as data: props plus emit listeners.
 */
export type KeywordsDefinition = Definition<KeywordsProps, KeywordsEmits>;
