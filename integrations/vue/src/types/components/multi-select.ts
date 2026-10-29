import type { CheckboxEmits, CheckboxProps } from "./checkbox";
import type { Option } from "../common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, HTMLAttributes, Ref, VNode } from "vue";
import type {
  SelectRootProps,
  SelectRootEmits,
  SelectTriggerProps,
  SelectContentProps,
  SelectContentEmits,
  SelectItemProps,
  SelectItemTextProps,
} from "reka-ui";

/**
 * The parts of the multi-select that accept passthrough. `trigger` is the
 * rendered button, so it also takes HTML attributes: a form lays its `id`
 * and `aria-describedby` there.
 */
export type MultiSelectPassthrough<T extends Option = Option> = {
  root: Passthrough<SelectRootProps, SelectRootEmits>;
  trigger: Passthrough<SelectTriggerProps & HTMLAttributes>;
  content: Passthrough<SelectContentProps, SelectContentEmits>;
  item: PassthroughIter<T, SelectItemProps>;
  itemCheckbox: PassthroughIter<T, CheckboxProps, CheckboxEmits>;
  itemText: Passthrough<SelectItemTextProps>;
};

/**
 * Props of the multi-select. `modelValue` is the array of selected
 * item objects.
 */
export type MultiSelectProps<T extends Option> = {
  modelValue?: NoInfer<T[] | undefined>;
  open?: boolean;
  items: T[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  pt?: PT<MultiSelectPassthrough<T>>;
};

/**
 * Emits of the multi-select.
 */
export type MultiSelectEmits<T extends Option> = {
  "update:modelValue": [value: T[] | undefined];
  "update:open": [value: boolean];
};

/**
 * The multi-select view model, served to `defineExpose` and the slots.
 * `display` is the trigger text.
 */
export type MultiSelectContext<T extends Option> = {
  items: T[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  modelValue: Ref<T[] | undefined>;
  open: Ref<boolean>;
  display: string;
  el: ComponentPublicInstance | null;
  settings: MultiSelectPassthrough<T>;
};

/**
 * Slots of the multi-select. Each slot receives the context.
 * Item slots also receive the `item` and its `selected` state.
 */
export type MultiSelectSlots<T extends Option> = {
  trigger?: (props: MultiSelectContext<T>) => VNode[];
  triggerLabel?: (props: MultiSelectContext<T>) => VNode[];
  content?: (props: MultiSelectContext<T>) => VNode[];
  item?: (
    props: MultiSelectContext<T> & { item: T; selected: boolean },
  ) => VNode[];
  itemCheckbox?: (
    props: MultiSelectContext<T> & { item: T; selected: boolean },
  ) => VNode[];
  itemText?: (props: MultiSelectContext<T> & { item: T }) => VNode[];
  triggerPrepend?: (props: MultiSelectContext<T>) => VNode[];
  triggerAppend?: (props: MultiSelectContext<T>) => VNode[];
};

/**
 * A multi-select instance as data: props plus emit listeners.
 */
export type MultiSelectDefinition<T extends Option> = Definition<
  MultiSelectProps<T>,
  MultiSelectEmits<T>
>;
