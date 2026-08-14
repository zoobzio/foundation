import type { IconProps } from "../common/icon";
import type { SpanProps } from "../common/span";
import type {
  SelectRootProps,
  SelectRootEmits,
} from "../common/select/root";
import type { SelectTriggerProps } from "../common/select/trigger";
import type {
  SelectContentProps,
  SelectContentEmits,
} from "../common/select/content";
import type { SelectItemProps } from "../common/select/item";
import type { SelectItemTextProps } from "../common/select/item-text";
import type { Option } from "./common";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type SelectPassthrough = {
  root: Passthrough<SelectRootProps, SelectRootEmits>;
  trigger: Passthrough<SelectTriggerProps>;
  triggerLabel: Passthrough<SpanProps>;
  triggerIcon: Passthrough<IconProps>;
  content: Passthrough<SelectContentProps, SelectContentEmits>;
  item: PassthroughIter<Option, SelectItemProps>;
  itemText: Passthrough<SelectItemTextProps>;
};

export type SelectProps<T extends Option> = {
  modelValue?: NoInfer<T>;
  open?: boolean;
  options: T[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  pt?: PT<SelectPassthrough>;
};

export type SelectEmits<T extends Option> = {
  "update:modelValue": [value: T];
  "update:open": [value: boolean];
};

export type SelectContext<T extends Option> = {
  options: T[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  modelValue: Ref<T | undefined>;
  display: string;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: SelectPassthrough;
};

export type SelectSlots<T extends Option> = {
  trigger?: (props: SelectContext<T>) => VNode[];
  triggerLabel?: (props: SelectContext<T>) => VNode[];
  triggerIcon?: (props: SelectContext<T>) => VNode[];
  content?: (props: SelectContext<T>) => VNode[];
  item?: (props: SelectContext<T> & { option: T }) => VNode[];
  itemText?: (props: SelectContext<T> & { option: T }) => VNode[];
};
