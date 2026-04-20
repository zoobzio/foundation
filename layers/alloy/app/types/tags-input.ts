import type { TagsInputRootProps, TagsInputItemProps, TagsInputItemTextProps, TagsInputItemDeleteProps, TagsInputInputProps } from "reka-ui";

export type TagsInputPassthrough = {
  root?: Passthrough<TagsInputRootProps>;
  item?: Passthrough<TagsInputItemProps>;
  itemText?: Passthrough<TagsInputItemTextProps>;
  itemDelete?: Passthrough<TagsInputItemDeleteProps>;
  input?: Passthrough<TagsInputInputProps>;
};

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
  pt?: TagsInputPassthrough;
};

export type TagsInputEmits = {} & MouseEvents & FocusEvents;

export const defineTagsInput = useComponentRecipe<TagsInputProps, TagsInputEmits>();

export type TagsInputRecipe = ComponentRecipe<TagsInputProps, TagsInputEmits>;
