import type {
  TagsInputRootProps,
  TagsInputRootEmits,
  TagsInputItemProps,
  TagsInputItemTextProps,
  TagsInputItemDeleteProps,
  TagsInputInputProps,
} from "reka-ui";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, HTMLAttributes, Ref, VNode } from "vue";

/**
 * The parts of the tags input that accept passthrough. `input` is the
 * rendered text input, so it also takes HTML attributes: a form lays its
 * `aria-describedby` there; the `id` is the root's, which reka hands on.
 */
export type TagsInputPassthrough = {
  root: Passthrough<TagsInputRootProps, TagsInputRootEmits>;
  item: PassthroughIter<string, TagsInputItemProps>;
  itemText: Passthrough<TagsInputItemTextProps>;
  itemDelete: Passthrough<TagsInputItemDeleteProps>;
  input: Passthrough<TagsInputInputProps & HTMLAttributes>;
};

/**
 * Props of the tags input. `delimiter` splits typed text into tags.
 */
export type TagsInputProps = {
  modelValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  max?: number;
  delimiter?: string | RegExp;
  pt?: PT<TagsInputPassthrough>;
};

/**
 * Emits of the tags input.
 */
export type TagsInputEmits = {
  "update:modelValue": [value: string[]];
};

/**
 * The tags input view model, served to `defineExpose` and the slots.
 */
export type TagsInputContext = {
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  max?: number;
  delimiter?: string | RegExp;
  modelValue: Ref<string[]>;
  el: ComponentPublicInstance | null;
  settings: TagsInputPassthrough;
};

/**
 * Slots of the tags input. Each slot receives the context.
 * Item slots also receive the `tag`.
 */
export type TagsInputSlots = {
  item?: (props: TagsInputContext & { tag: string }) => VNode[];
  itemText?: (props: TagsInputContext & { tag: string }) => VNode[];
  itemDelete?: (props: TagsInputContext & { tag: string }) => VNode[];
  itemDeleteIcon?: (props: TagsInputContext & { tag: string }) => VNode[];
  input?: (props: TagsInputContext) => VNode[];
};

/**
 * A tags input instance as data: props plus emit listeners.
 */
export type TagsInputDefinition = Definition<TagsInputProps, TagsInputEmits>;
