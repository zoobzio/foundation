import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance } from "vue";
import type { TagsInputInputProps as RekaTagsInputInputProps } from "reka-ui";

export type TagsInputInputForward = Reshape<RekaTagsInputInputProps>;

export type TagsInputInputProps = RekaTagsInputInputProps & {
  modifiers?: ModifierProps<"tags-input-input">;
  tokens?: TokenProps<"tags-input-input">;
  aria?: AriaProps<"tags-input-input">;
};

export type TagsInputInputEmits = {};

export type TagsInputInputBindings = Bindings<"tags-input-input", TagsInputInputForward>;

export type TagsInputInputContext = Reshape<TagsInputInputProps> & {
  bindings: TagsInputInputBindings;
  el: ComponentPublicInstance | null;
};
