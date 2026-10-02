import type {
  ToggleGroupRootProps,
  ToggleGroupRootEmits,
  ToggleGroupItemProps,
} from "reka-ui";
import type { LinkTarget, Option } from "./common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * A segment. `link` makes it a real hyperlink rendered through NuxtLink —
 * view switchers whose state lives in the URL; the press still updates the
 * model, so bind `modelValue` to the route to keep the pressed segment in
 * sync.
 */
export type SegmentedControlOption = Option & {
  link?: LinkTarget;
};

export type SegmentedControlPassthrough<
  T extends SegmentedControlOption = SegmentedControlOption,
> = {
  root: Passthrough<ToggleGroupRootProps, ToggleGroupRootEmits>;
  item: PassthroughIter<T, ToggleGroupItemProps>;
};

export type SegmentedControlProps<
  T extends SegmentedControlOption = SegmentedControlOption,
> = {
  modelValue?: string;
  options: T[];
  disabled?: boolean;
  required?: boolean;
  pt?: PT<SegmentedControlPassthrough<T>>;
};

export type SegmentedControlEmits = {
  "update:modelValue": [value: string];
};

export type SegmentedControlContext<
  T extends SegmentedControlOption = SegmentedControlOption,
> = {
  options: T[];
  disabled?: boolean;
  required?: boolean;
  modelValue: Ref<string | undefined>;
  el: ComponentPublicInstance | null;
  settings: SegmentedControlPassthrough<T>;
};

export type SegmentedControlSlots<
  T extends SegmentedControlOption = SegmentedControlOption,
> = {
  item?: (props: SegmentedControlContext<T> & { option: T }) => VNode[];
  itemIcon?: (props: SegmentedControlContext<T> & { option: T }) => VNode[];
  itemLabel?: (props: SegmentedControlContext<T> & { option: T }) => VNode[];
};
