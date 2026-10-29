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
 * The parts of the select that accept passthrough. `trigger` is the
 * rendered button, so it also takes HTML attributes: a form lays its `id`
 * and `aria-describedby` there.
 */
export type SelectPassthrough<T extends Option = Option> = {
  root: Passthrough<SelectRootProps, SelectRootEmits>;
  trigger: Passthrough<SelectTriggerProps & HTMLAttributes>;
  content: Passthrough<SelectContentProps, SelectContentEmits>;
  item: PassthroughIter<T, SelectItemProps>;
  itemText: Passthrough<SelectItemTextProps>;
};

/**
 * Props of the select. `modelValue` is the selected option object.
 */
export type SelectProps<T extends Option = Option> = {
  modelValue?: NoInfer<T>;
  open?: boolean;
  options: T[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  pt?: PT<SelectPassthrough<T>>;
};

/**
 * Emits of the select.
 */
export type SelectEmits<T extends Option = Option> = {
  "update:modelValue": [value: T];
  "update:open": [value: boolean];
};

/**
 * The select view model, served to `defineExpose` and the slots.
 * `display` is the trigger text.
 */
export type SelectContext<T extends Option = Option> = {
  options: T[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  modelValue: Ref<T | undefined>;
  display: string;
  open: Ref<boolean>;
  el: ComponentPublicInstance | null;
  settings: SelectPassthrough<T>;
};

/**
 * Slots of the select. Each slot receives the context.
 * Item slots also receive the `option`.
 */
export type SelectSlots<T extends Option = Option> = {
  trigger?: (props: SelectContext<T>) => VNode[];
  triggerLabel?: (props: SelectContext<T>) => VNode[];
  content?: (props: SelectContext<T>) => VNode[];
  item?: (props: SelectContext<T> & { option: T }) => VNode[];
  itemText?: (props: SelectContext<T> & { option: T }) => VNode[];
  triggerPrepend?: (props: SelectContext<T>) => VNode[];
  triggerAppend?: (props: SelectContext<T>) => VNode[];
};

/**
 * A select instance as data: props plus emit listeners.
 */
export type SelectDefinition<T extends Option> = Definition<
  SelectProps<T>,
  SelectEmits<T>
>;
