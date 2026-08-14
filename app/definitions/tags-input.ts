import type { TagsInputEmits, TagsInputProps } from "../types/core/tags-input";
import type { Definition } from "../types/definition";

/**
 * A tags-input instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type TagsInputDefinition = Definition<
  TagsInputProps,
  TagsInputEmits
>;

/**
 * Declares a tags-input at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineTagsInput = (
  definition: TagsInputDefinition,
): TagsInputDefinition => definition;
