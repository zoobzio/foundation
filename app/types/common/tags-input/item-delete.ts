import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TagsInputItemDeleteProps as RekaTagsInputItemDeleteProps } from "reka-ui";

export type TagsInputItemDeleteForward = Reshape<RekaTagsInputItemDeleteProps>;

export type TagsInputItemDeleteProps = RekaTagsInputItemDeleteProps & {
  modifiers?: ModifierProps<"tags-input-item-delete">;
  tokens?: TokenProps<"tags-input-item-delete">;
  aria?: AriaProps<"tags-input-item-delete">;
};

export type TagsInputItemDeleteEmits = EventEmits<"click">;

export type TagsInputItemDeleteBindings = Bindings<"tags-input-item-delete", TagsInputItemDeleteForward>;

export type TagsInputItemDeleteContext = Reshape<TagsInputItemDeleteProps> & {
  bindings: TagsInputItemDeleteBindings;
  el: ComponentPublicInstance | null;
};

export type TagsInputItemDeleteSlots = {
  default(props: TagsInputItemDeleteContext): VNode[];
};
