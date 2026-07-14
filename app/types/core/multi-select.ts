import type { ButtonProps } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { SpanProps } from "#foundation/types/common/span";
import type { CheckboxEmits, CheckboxProps } from "#foundation/types/core/checkbox";
import type { Option } from "#foundation/types/core/common";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { PopoverEmits, PopoverProps } from "#foundation/types/core/popover";
import type { Recipe } from "#foundation/types/core/recipe";
export type MultiSelectPassthrough = {
  popover?: Passthrough<PopoverProps, PopoverEmits>;
  trigger?: Passthrough<ButtonProps>;
  triggerLabel?: Passthrough<SpanProps>;
  triggerIcon?: Passthrough<IconProps>;
  content?: Passthrough<GroupProps>;
  item?: Passthrough<ButtonProps>;
  itemCheckbox?: Passthrough<CheckboxProps, CheckboxEmits>;
  itemLabel?: Passthrough<SpanProps>;
};

export type MultiSelectProps = {
  modelValue?: string[];
  items: Option[];
  placeholder?: string;
  disabled?: boolean;
  pt?: MultiSelectPassthrough;
};

export type MultiSelectEmits = {
  "update:modelValue": [value: string[]];
};

export type MultiSelectRecipe = Recipe<MultiSelectProps, MultiSelectEmits>;
