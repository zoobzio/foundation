import type { IconProps } from "#foundation/types/common/icon";
import type {
  TabsRootProps,
  TabsRootEmits,
} from "#foundation/types/common/tabs/root";
import type { TabsListProps } from "#foundation/types/common/tabs/list";
import type { TabsTriggerProps } from "#foundation/types/common/tabs/trigger";
import type { TabsContentProps } from "#foundation/types/common/tabs/content";
import type { Option } from "#foundation/types/core/common";
import type { ComponentEvents } from "#foundation/types/events";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type TabsPassthrough = {
  root: Passthrough<TabsRootProps, TabsRootEmits>;
  list: Passthrough<TabsListProps>;
  trigger: PassthroughIter<Option, TabsTriggerProps>;
  triggerIcon: PassthroughIter<Option, IconProps>;
  content: PassthroughIter<Option, TabsContentProps>;
};

export type TabsProps = {
  modelValue?: string;
  tabs: Option[];
  pt?: PT<TabsPassthrough>;
};

export type TabsEmits = ComponentEvents["tabs"] & {
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
