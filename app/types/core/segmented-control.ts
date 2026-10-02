import type {
  ToggleGroupRootProps,
  ToggleGroupRootEmits,
  ToggleGroupItemProps,
} from "reka-ui";
import type { Option } from "./common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type SegmentedControlPassthrough<T extends Option = Option> = {
  root: Passthrough<ToggleGroupRootProps, ToggleGroupRootEmits>;
  item: PassthroughIter<T, ToggleGroupItemProps>;
};

export type SegmentedControlProps<T extends Option = Option> = {
  modelValue?: string;
  options: T[];
  disabled?: boolean;
  required?: boolean;
  pt?: PT<SegmentedControlPassthrough<T>>;
};

export type SegmentedControlEmits = {
  "update:modelValue": [value: string];
};

export type SegmentedControlContext<T extends Option = Option> = {
  options: T[];
  disabled?: boolean;
  required?: boolean;
  modelValue: Ref<string | undefined>;
  el: ComponentPublicInstance | null;
  settings: SegmentedControlPassthrough<T>;
};

export type SegmentedControlSlots<T extends Option = Option> = {
  item?: (props: SegmentedControlContext<T> & { option: T }) => VNode[];
  itemIcon?: (props: SegmentedControlContext<T> & { option: T }) => VNode[];
  itemLabel?: (props: SegmentedControlContext<T> & { option: T }) => VNode[];
};
