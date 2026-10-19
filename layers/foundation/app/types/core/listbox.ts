import type { Option } from "./common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  ListboxRootProps,
  ListboxRootEmits,
  ListboxContentProps,
  ListboxItemProps,
  ListboxItemEmits,
} from "reka-ui";

export type ListboxPassthrough<T extends Option = Option> = {
  root: Passthrough<ListboxRootProps, ListboxRootEmits>;
  content: Passthrough<ListboxContentProps>;
  item: PassthroughIter<T, ListboxItemProps, ListboxItemEmits>;
};

export type ListboxProps<T extends Option = Option> = {
  items: T[];
  modelValue?: string | string[];
  multiple?: boolean;
  disabled?: boolean;
  pt?: PT<ListboxPassthrough<T>>;
};

export type ListboxEmits = {
  "update:modelValue": [value: string | string[]];
};

export type ListboxContext<T extends Option = Option> = {
  items: T[];
  multiple?: boolean;
  disabled?: boolean;
  modelValue: Ref<string | string[] | undefined>;
  el: ComponentPublicInstance | null;
  settings: ListboxPassthrough<T>;
};

export type ListboxSlots<T extends Option = Option> = {
  content?: (props: ListboxContext<T>) => VNode[];
  item?: (props: ListboxContext<T> & { item: T }) => VNode[];
};
