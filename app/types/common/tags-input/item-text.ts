import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TagsInputItemTextProps as RekaTagsInputItemTextProps } from "reka-ui";

export type TagsInputItemTextForward = Reshape<RekaTagsInputItemTextProps>;

export type TagsInputItemTextProps = RekaTagsInputItemTextProps & {
  modifiers?: ModifierProps<"tags-input-item-text">;
  tokens?: TokenProps<"tags-input-item-text">;
  aria?: AriaProps<"tags-input-item-text">;
};

export type TagsInputItemTextEmits = ComponentEvents["tags-input-item-text"];

export type TagsInputItemTextBindings = Bindings<"tags-input-item-text", TagsInputItemTextForward>;

export type TagsInputItemTextContext = Reshape<TagsInputItemTextProps> & {
  bindings: TagsInputItemTextBindings;
  el: ComponentPublicInstance | null;
};

export type TagsInputItemTextSlots = {
  default(props: TagsInputItemTextContext): VNode[];
};
