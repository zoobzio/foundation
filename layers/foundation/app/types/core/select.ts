import type { Option } from "./common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  SelectRootProps,
  SelectRootEmits,
  SelectTriggerProps,
  SelectContentProps,
  SelectContentEmits,
  SelectItemProps,
  SelectItemTextProps,
} from "reka-ui";

export type SelectPassthrough<T extends Option = Option> = {
  root: Passthrough<SelectRootProps, SelectRootEmits>;
  trigger: Passthrough<SelectTriggerProps>;
  content: Passthrough<SelectContentProps, SelectContentEmits>;
  item: PassthroughIter<T, SelectItemProps>;
  itemText: Passthrough<SelectItemTextProps>;
};

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

export type SelectEmits<T extends Option = Option> = {
  "update:modelValue": [value: T];
  "update:open": [value: boolean];
};

export type SelectContext<T extends Option = Option> = {
  options: T[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  modelValue: Ref<T | undefined>;
  display: string;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: SelectPassthrough<T>;
};

export type SelectSlots<T extends Option = Option> = {
  trigger?: (props: SelectContext<T>) => VNode[];
  triggerLabel?: (props: SelectContext<T>) => VNode[];
  triggerIcon?: (props: SelectContext<T>) => VNode[];
  content?: (props: SelectContext<T>) => VNode[];
  item?: (props: SelectContext<T> & { option: T }) => VNode[];
  itemText?: (props: SelectContext<T> & { option: T }) => VNode[];
};
