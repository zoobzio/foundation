import type {
  ToggleGroupRootProps,
  ToggleGroupRootEmits,
  ToggleGroupItemProps,
} from "reka-ui";
import type { LinkProps, LinkTarget, Option } from "../common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * A segment. With `link`, the segment renders as an anchor and navigates
 * on press. The press still updates the model.
 */
export interface SegmentedControlOption extends Option {
  link?: LinkTarget;
}

/**
 * The parts of the segmented control that accept passthrough. `link` is
 * the anchor a linked item renders as child, built per option.
 */
export type SegmentedControlPassthrough<
  T extends SegmentedControlOption = SegmentedControlOption,
> = {
  root: Passthrough<ToggleGroupRootProps, ToggleGroupRootEmits>;
  item: PassthroughIter<T, ToggleGroupItemProps>;
  link: PassthroughIter<T, LinkProps>;
};

/**
 * Props of the segmented control. `modelValue` is the pressed option
 * value. With `required`, the pressed segment cannot deselect.
 */
export type SegmentedControlProps<
  T extends SegmentedControlOption = SegmentedControlOption,
> = {
  modelValue?: string;
  options: T[];
  disabled?: boolean;
  required?: boolean;
  pt?: PT<SegmentedControlPassthrough<T>>;
};

/**
 * Emits of the segmented control.
 */
export type SegmentedControlEmits = {
  "update:modelValue": [value: string];
};

/**
 * The segmented control view model, served to `defineExpose` and the
 * slots.
 */
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

/**
 * Slots of the segmented control. Each slot receives the context and
 * the `option`.
 */
export type SegmentedControlSlots<
  T extends SegmentedControlOption = SegmentedControlOption,
> = {
  item?: (props: SegmentedControlContext<T> & { option: T }) => VNode[];
  itemIcon?: (props: SegmentedControlContext<T> & { option: T }) => VNode[];
  itemLabel?: (props: SegmentedControlContext<T> & { option: T }) => VNode[];
};

/**
 * A segmented control instance as data: props plus emit listeners.
 */
export type SegmentedControlDefinition<
  T extends SegmentedControlOption = SegmentedControlOption,
> = Definition<SegmentedControlProps<T>, SegmentedControlEmits>;
