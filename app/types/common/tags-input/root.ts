import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
