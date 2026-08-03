import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance } from "vue";
import type { TagsInputInputProps as RekaTagsInputInputProps } from "reka-ui";

export type TagsInputInputForward = Reshape<RekaTagsInputInputProps>;

export type TagsInputInputProps = RekaTagsInputInputProps & {
  modifiers?: ModifierProps<"tags-input-input">;
  tokens?: TokenProps<"tags-input-input">;
  aria?: AriaProps<"tags-input-input">;
};

export type TagsInputInputEmits = ComponentEvents["tags-input-input"];

export type TagsInputInputBindings = Bindings<"tags-input-input", TagsInputInputForward>;

export type TagsInputInputContext = Reshape<TagsInputInputProps> & {
  bindings: TagsInputInputBindings;
  el: ComponentPublicInstance | null;
};
