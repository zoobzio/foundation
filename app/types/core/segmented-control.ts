import type { IconProps } from "#foundation/types/common/icon";
import type { SpanProps } from "#foundation/types/common/span";
import type { Option } from "#foundation/types/core/common";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { ToggleGroupRootProps, ToggleGroupRootEmits, ToggleGroupItemProps } from "reka-ui";

export type SegmentedControlPassthrough = {
  root?: Passthrough<ToggleGroupRootProps, ToggleGroupRootEmits>;
  item?: Passthrough<ToggleGroupItemProps>;
  itemIcon?: Passthrough<IconProps>;
  itemLabel?: Passthrough<SpanProps>;
};

export type SegmentedControlProps = {
  modelValue?: string;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  pt?: SegmentedControlPassthrough;
};

export type SegmentedControlEmits = {
  "update:modelValue": [value: string];
};

export type SegmentedControlRecipe = Recipe<SegmentedControlProps, SegmentedControlEmits>;
