import type { IconProps } from "#foundation/types/common/icon";
import type { SpanProps } from "#foundation/types/common/span";
import type { Option } from "#foundation/types/core/common";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { SelectRootProps, SelectRootEmits, SelectTriggerProps, SelectContentProps, SelectContentEmits, SelectItemProps, SelectItemTextProps } from "reka-ui";

export type SelectPassthrough = {
  root?: Passthrough<SelectRootProps, SelectRootEmits>;
  trigger?: Passthrough<SelectTriggerProps>;
  triggerLabel?: Passthrough<SpanProps>;
  triggerIcon?: Passthrough<IconProps>;
  content?: Passthrough<SelectContentProps, SelectContentEmits>;
  item?: Passthrough<SelectItemProps>;
  itemText?: Passthrough<SelectItemTextProps>;
};

export type SelectProps = {
  modelValue?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  pt?: SelectPassthrough;
};

export type SelectEmits = {
  "update:modelValue": [value: string];
};

export type SelectRecipe = Recipe<SelectProps, SelectEmits>;
