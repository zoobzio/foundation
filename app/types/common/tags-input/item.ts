import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TagsInputItemProps as RekaTagsInputItemProps } from "reka-ui";

export type TagsInputItemForward = Reshape<RekaTagsInputItemProps>;

export type TagsInputItemProps = RekaTagsInputItemProps & {
  modifiers?: ModifierProps<"tags-input-item">;
  tokens?: TokenProps<"tags-input-item">;
  aria?: AriaProps<"tags-input-item">;
};

export type TagsInputItemEmits = ComponentEvents["tags-input-item"];

export type TagsInputItemBindings = Bindings<"tags-input-item", TagsInputItemForward>;

export type TagsInputItemContext = Reshape<TagsInputItemProps> & {
  bindings: TagsInputItemBindings;
  el: ComponentPublicInstance | null;
};

export type TagsInputItemSlots = {
  default(props: TagsInputItemContext): VNode[];
};
