import type { Option } from "../common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  ListboxRootProps,
  ListboxRootEmits,
  ListboxContentProps,
  ListboxItemProps,
  ListboxItemEmits,
} from "reka-ui";

/**
 * The parts of the listbox that accept passthrough.
 */
export type ListboxPassthrough<T extends Option = Option> = {
  root: Passthrough<ListboxRootProps, ListboxRootEmits>;
  content: Passthrough<ListboxContentProps>;
  item: PassthroughIter<T, ListboxItemProps, ListboxItemEmits>;
};

/**
 * Props of the listbox. `modelValue` holds item values. With `multiple`
 * it is an array.
 */
export type ListboxProps<T extends Option = Option> = {
  items: T[];
  modelValue?: string | string[];
  multiple?: boolean;
  disabled?: boolean;
  pt?: PT<ListboxPassthrough<T>>;
};

/**
 * Emits of the listbox.
 */
export type ListboxEmits = {
  "update:modelValue": [value: string | string[]];
};

/**
 * The listbox view model, served to `defineExpose` and the slots.
 */
export type ListboxContext<T extends Option = Option> = {
  items: T[];
  multiple?: boolean;
  disabled?: boolean;
  modelValue: Ref<string | string[] | undefined>;
  el: ComponentPublicInstance | null;
  settings: ListboxPassthrough<T>;
};

/**
 * Slots of the listbox. Each slot receives the context.
 * The item slot also receives the `item`.
 */
export type ListboxSlots<T extends Option = Option> = {
  content?: (props: ListboxContext<T>) => VNode[];
  item?: (props: ListboxContext<T> & { item: T }) => VNode[];
};

/**
 * A listbox instance as data: props plus emit listeners.
 */
export type ListboxDefinition<T extends Option = Option> = Definition<
  ListboxProps<T>,
  ListboxEmits
>;
