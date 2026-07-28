import type { IconProps } from "#foundation/types/common/icon";
import type { SpanProps } from "#foundation/types/common/span";
import type {
  ToggleGroupRootProps,
  ToggleGroupRootEmits,
} from "#foundation/types/common/toggle-group/root";
import type { ToggleGroupItemProps } from "#foundation/types/common/toggle-group/item";
import type { Option } from "#foundation/types/core/common";
import type { ComponentEvents } from "#foundation/types/events";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type SegmentedControlPassthrough = {
  root: Passthrough<ToggleGroupRootProps, ToggleGroupRootEmits>;
  item: PassthroughIter<Option, ToggleGroupItemProps>;
  itemIcon: PassthroughIter<Option, IconProps>;
  itemLabel: Passthrough<SpanProps>;
};

export type SegmentedControlProps = {
  modelValue?: string;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  pt?: PT<SegmentedControlPassthrough>;
};

export type SegmentedControlEmits = ComponentEvents["segmented-control"] & {
  "update:modelValue": [value: string];
};

export type SegmentedControlContext = {
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  modelValue: Ref<string | undefined>;
  el: ComponentPublicInstance | null;
  settings: SegmentedControlPassthrough;
};

export type SegmentedControlSlots = {
  item?: (props: SegmentedControlContext & { option: Option }) => VNode[];
  itemIcon?: (props: SegmentedControlContext & { option: Option }) => VNode[];
  itemLabel?: (props: SegmentedControlContext & { option: Option }) => VNode[];
};
