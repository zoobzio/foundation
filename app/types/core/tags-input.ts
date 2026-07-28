import type { IconProps } from "#foundation/types/common/icon";
import type {
  TagsInputRootProps,
  TagsInputRootEmits,
} from "#foundation/types/common/tags-input/root";
import type { TagsInputItemProps } from "#foundation/types/common/tags-input/item";
import type { TagsInputItemTextProps } from "#foundation/types/common/tags-input/item-text";
import type {
  TagsInputItemDeleteProps,
  TagsInputItemDeleteEmits,
} from "#foundation/types/common/tags-input/item-delete";
import type { TagsInputInputProps } from "#foundation/types/common/tags-input/input";
import type { ComponentEvents } from "#foundation/types/events";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type TagsInputPassthrough = {
  root: Passthrough<TagsInputRootProps, TagsInputRootEmits>;
  item: PassthroughIter<string, TagsInputItemProps>;
  itemText: Passthrough<TagsInputItemTextProps>;
  itemDelete: Passthrough<TagsInputItemDeleteProps, TagsInputItemDeleteEmits>;
  itemDeleteIcon: Passthrough<IconProps>;
  input: Passthrough<TagsInputInputProps>;
};

export type TagsInputProps = {
  modelValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  max?: number;
  delimiter?: string | RegExp;
  pt?: PT<TagsInputPassthrough>;
};

export type TagsInputEmits = ComponentEvents["tags-input"] & {
  "update:modelValue": [value: string[]];
};

export type TagsInputContext = {
  placeholder: string;
  disabled?: boolean;
  max?: number;
  delimiter?: string | RegExp;
  modelValue: Ref<string[] | undefined>;
  el: ComponentPublicInstance | null;
  settings: TagsInputPassthrough;
};

export type TagsInputSlots = {
  item?: (props: TagsInputContext & { tag: string }) => VNode[];
  itemText?: (props: TagsInputContext & { tag: string }) => VNode[];
  itemDelete?: (props: TagsInputContext & { tag: string }) => VNode[];
  itemDeleteIcon?: (props: TagsInputContext & { tag: string }) => VNode[];
  input?: (props: TagsInputContext) => VNode[];
};
