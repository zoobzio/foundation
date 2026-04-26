import type { TagsInputRootProps, TagsInputRootEmits, TagsInputItemProps, TagsInputItemTextProps, TagsInputItemDeleteProps, TagsInputInputProps } from "reka-ui";

export type TagsInputPassthrough = {
  root?: Passthrough<TagsInputRootProps, TagsInputRootEmits>;
  item?: Passthrough<TagsInputItemProps>;
  itemText?: Passthrough<TagsInputItemTextProps>;
  itemDelete?: Passthrough<TagsInputItemDeleteProps>;
  itemDeleteIcon?: Passthrough<IconProps>;
  input?: Passthrough<TagsInputInputProps>;
};

export type TagsInputProps = {
  modelValue?: string[];
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

export type TagsInputEmits = {
  "update:modelValue": [value: string[]];
};

export type TagsInputRecipe = Recipe<TagsInputProps, TagsInputEmits>;
