import type { Option } from "#foundation/types/core/common";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { ListboxRootProps, ListboxRootEmits, ListboxContentProps, ListboxItemProps, ListboxItemEmits } from "reka-ui";

export type ListboxPassthrough = {
  root?: Passthrough<ListboxRootProps, ListboxRootEmits>;
  content?: Passthrough<ListboxContentProps>;
  item?: Passthrough<ListboxItemProps, ListboxItemEmits>;
};

export type ListboxProps = {
  items: Option[];
  modelValue?: string | string[];
  multiple?: boolean;
  disabled?: boolean;
  pt?: ListboxPassthrough;
};

export type ListboxEmits = {
  "update:modelValue": [string | string[]];
};

export type ListboxRecipe = Recipe<ListboxProps, ListboxEmits>;
