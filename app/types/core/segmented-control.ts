import type { IconProps } from "../common/icon";
import type { SpanProps } from "../common/span";
import type {
  ToggleGroupRootProps,
  ToggleGroupRootEmits,
} from "../common/toggle-group/root";
import type { ToggleGroupItemProps } from "../common/toggle-group/item";
import type { Option } from "./common";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
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

export type SegmentedControlEmits = {
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
