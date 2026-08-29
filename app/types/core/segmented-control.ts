import type {
  ToggleGroupRootProps,
  ToggleGroupRootEmits,
  ToggleGroupItemProps,
} from "reka-ui";
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
