import type {
  TabsRootProps,
  TabsRootEmits,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "reka-ui";
import type { Option } from "./common";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type TabsPassthrough = {
  root: Passthrough<TabsRootProps, TabsRootEmits>;
  list: Passthrough<TabsListProps>;
  trigger: PassthroughIter<Option, TabsTriggerProps>;
  content: PassthroughIter<Option, TabsContentProps>;
};

export type TabsProps = {
  modelValue?: string;
  tabs: Option[];
  pt?: PT<TabsPassthrough>;
};

export type TabsEmits = {
  "update:modelValue": [value: string];
};

export type TabsContext = {
  tabs: Option[];
  modelValue: Ref<string | undefined>;
  el: ComponentPublicInstance | null;
  settings: TabsPassthrough;
};

export type TabsSlots = {
  list?: (props: TabsContext) => VNode[];
  trigger?: (props: TabsContext & { option: Option }) => VNode[];
  content?: (props: TabsContext & { option: Option }) => VNode[];
};
