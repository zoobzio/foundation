import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TagsInputItemDeleteProps as RekaTagsInputItemDeleteProps } from "reka-ui";

export type TagsInputItemDeleteForward = Reshape<RekaTagsInputItemDeleteProps>;

export type TagsInputItemDeleteProps = RekaTagsInputItemDeleteProps & {
  modifiers?: ModifierProps<"tags-input-item-delete">;
  tokens?: TokenProps<"tags-input-item-delete">;
  aria?: AriaProps<"tags-input-item-delete">;
};

export type TagsInputItemDeleteEmits = ComponentEvents["tags-input-item-delete"];

export type TagsInputItemDeleteBindings = Bindings<"tags-input-item-delete", TagsInputItemDeleteForward>;

export type TagsInputItemDeleteContext = Reshape<TagsInputItemDeleteProps> & {
  bindings: TagsInputItemDeleteBindings;
  el: ComponentPublicInstance | null;
};

export type TagsInputItemDeleteSlots = {
  default(props: TagsInputItemDeleteContext): VNode[];
};
