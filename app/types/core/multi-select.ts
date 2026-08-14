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
import type {
  CheckboxEmits,
  CheckboxProps,
} from "./checkbox";
import type { Option } from "./common";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type MultiSelectPassthrough<T extends Option = Option> = {
  root: Passthrough<SelectRootProps, SelectRootEmits>;
  trigger: Passthrough<SelectTriggerProps>;
  triggerLabel: Passthrough<SpanProps>;
  triggerIcon: Passthrough<IconProps>;
  content: Passthrough<SelectContentProps, SelectContentEmits>;
  item: PassthroughIter<T, SelectItemProps>;
  itemCheckbox: PassthroughIter<T, CheckboxProps, CheckboxEmits>;
  itemText: Passthrough<SelectItemTextProps>;
};

export type MultiSelectProps<T extends Option> = {
  modelValue?: NoInfer<T[] | undefined>;
  open?: boolean;
  items: T[];
  placeholder?: string;
  disabled?: boolean;
  pt?: PT<MultiSelectPassthrough<T>>;
};

export type MultiSelectEmits<T extends Option> =
  {
    "update:modelValue": [value: T[] | undefined];
    "update:open": [value: boolean];
  };

export type MultiSelectContext<T extends Option> = {
  items: T[];
  placeholder: string;
  disabled?: boolean;
  modelValue: Ref<T[] | undefined>;
  open: Ref<boolean | undefined>;
  display: string;
  el: ComponentPublicInstance | null;
  settings: MultiSelectPassthrough<T>;
};

export type MultiSelectSlots<T extends Option> = {
  trigger?: (props: MultiSelectContext<T>) => VNode[];
  triggerLabel?: (props: MultiSelectContext<T>) => VNode[];
  triggerIcon?: (props: MultiSelectContext<T>) => VNode[];
  content?: (props: MultiSelectContext<T>) => VNode[];
  item?: (
    props: MultiSelectContext<T> & { item: T; selected: boolean },
  ) => VNode[];
  itemCheckbox?: (
    props: MultiSelectContext<T> & { item: T; selected: boolean },
  ) => VNode[];
  itemText?: (props: MultiSelectContext<T> & { item: T }) => VNode[];
};
