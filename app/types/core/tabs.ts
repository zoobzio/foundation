import type {
  TabsRootProps,
  TabsRootEmits,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "reka-ui";
import type { Option } from "./common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type TabsPassthrough<T extends Option = Option> = {
  root: Passthrough<TabsRootProps, TabsRootEmits>;
  list: Passthrough<TabsListProps>;
  trigger: PassthroughIter<T, TabsTriggerProps>;
  content: PassthroughIter<T, TabsContentProps>;
};

export type TabsProps<T extends Option = Option> = {
  modelValue?: string;
  tabs: T[];
  pt?: PT<TabsPassthrough<T>>;
};

export type TabsEmits = {
  "update:modelValue": [value: string];
};

export type TabsContext<T extends Option = Option> = {
  tabs: T[];
  modelValue: Ref<string | undefined>;
  el: ComponentPublicInstance | null;
  settings: TabsPassthrough<T>;
};

export type TabsSlots<T extends Option = Option> = {
  list?: (props: TabsContext<T>) => VNode[];
  trigger?: (props: TabsContext<T> & { option: T }) => VNode[];
  triggerIcon?: (props: TabsContext<T> & { option: T }) => VNode[];
  content?: (props: TabsContext<T> & { option: T }) => VNode[];
};
