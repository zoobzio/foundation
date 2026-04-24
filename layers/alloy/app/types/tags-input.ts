import type { TagsInputRootProps, TagsInputRootEmits, TagsInputItemProps, TagsInputItemTextProps, TagsInputItemDeleteProps, TagsInputInputProps } from "reka-ui";

export type TagsInputPassthrough = {
  root?: Passthrough<TagsInputRootProps, TagsInputRootEmits>;
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

export type TagsInputEmits = {};

export const defineTagsInput = defineComponentRecipe<TagsInputProps, TagsInputEmits>();

export type TagsInputRecipe = Recipe<TagsInputProps, TagsInputEmits>;
