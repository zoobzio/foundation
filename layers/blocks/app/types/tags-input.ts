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
    | "tags-input-root"
    | "tags-input-item"
    | "tags-input-item-text"
    | "tags-input-item-delete"
    | "tags-input-input"
    | "tags-input-clear"
  >;
};

export type TagsInputEmits = {};

export const defineTagsInput = useComponentRecipe<
  TagsInputProps,
  TagsInputEmits & FocusEvents
>();
