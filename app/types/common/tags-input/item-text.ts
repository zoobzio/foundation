import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
