import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
