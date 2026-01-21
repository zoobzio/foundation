import type { tagsInput } from "../../elements.config";

export type TagsInputProps = {
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  max?: number;
  addOnBlur?: boolean;
  addOnPaste?: boolean;
  addOnTab?: boolean;
  delimiter?: string;
  duplicate?: boolean;
  tokens?: Tokens<
    | typeof tagsInput.root
    | typeof tagsInput.item
    | typeof tagsInput.itemText
    | typeof tagsInput.itemDelete
    | typeof tagsInput.input
    | typeof tagsInput.clear
  >;
};

export type TagsInputEmits = {};

export const defineTagsInput = useComponentRecipe<
  TagsInputProps,
  TagsInputEmits & FocusEvents
>();
