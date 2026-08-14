import type {
  ListboxRootProps,
  ListboxRootEmits,
} from "../common/listbox/root";
import type { ListboxContentProps } from "../common/listbox/content";
import type {
  ListboxItemProps,
  ListboxItemEmits,
} from "../common/listbox/item";
import type { Option } from "./common";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type ListboxPassthrough = {
  root: Passthrough<ListboxRootProps, ListboxRootEmits>;
  content: Passthrough<ListboxContentProps>;
  item: PassthroughIter<Option, ListboxItemProps, ListboxItemEmits>;
};

export type ListboxProps = {
  items: Option[];
  modelValue?: string | string[];
  multiple?: boolean;
  disabled?: boolean;
  pt?: PT<ListboxPassthrough>;
};

export type ListboxEmits = {
  "update:modelValue": [value: string | string[]];
};

export type ListboxContext = {
  items: Option[];
  multiple?: boolean;
  disabled?: boolean;
  modelValue: Ref<string | string[] | undefined>;
  el: ComponentPublicInstance | null;
  settings: ListboxPassthrough;
};

export type ListboxSlots = {
  content?: (props: ListboxContext) => VNode[];
  item?: (props: ListboxContext & { item: Option }) => VNode[];
};
