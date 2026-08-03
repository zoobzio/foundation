import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  AcceptableInputValue,
  TagsInputRootProps as RekaTagsInputRootProps,
} from "reka-ui";

export type TagsInputRootForward = Reshape<RekaTagsInputRootProps, "modelValue">;

export type TagsInputRootProps = RekaTagsInputRootProps & {
  modifiers?: ModifierProps<"tags-input-root">;
  tokens?: TokenProps<"tags-input-root">;
  aria?: AriaProps<"tags-input-root">;
};

// reka's TagsInputRootEmits also carries invalid/addTag/removeTag; those fall
// through as attrs (README § behavioral elements). The root declares only the
// model emit useModel needs.
export type TagsInputRootEmits = {
  "update:modelValue": [value: AcceptableInputValue[]];
} & ComponentEvents["tags-input-root"];

export type TagsInputRootBindings = Bindings<"tags-input-root", TagsInputRootForward>;

export type TagsInputRootContext = Reshape<TagsInputRootProps, "modelValue"> & {
  modelValue: Ref<AcceptableInputValue[] | undefined>;
  bindings: TagsInputRootBindings;
  el: ComponentPublicInstance | null;
};

export type TagsInputRootSlots = {
  default(props: TagsInputRootContext): VNode[];
};
