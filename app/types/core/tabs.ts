import type {
  TabsRootProps,
  TabsRootEmits,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "reka-ui";
import type { LinkTarget, Option } from "./common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * A tab. `link` makes its trigger a real hyperlink rendered through NuxtLink
 * — route-driven tabs where the URL owns the selection. Any linked tab
 * switches the root to manual activation, so arrow keys only move focus and
 * the active tab changes only on click or Enter, in step with navigation.
 * Bind `modelValue` to the route to keep the active tab in sync.
 */
export type TabsOption = Option & {
  link?: LinkTarget;
};

export type TabsPassthrough<T extends TabsOption = TabsOption> = {
  root: Passthrough<TabsRootProps, TabsRootEmits>;
  list: Passthrough<TabsListProps>;
  trigger: PassthroughIter<T, TabsTriggerProps>;
  content: PassthroughIter<T, TabsContentProps>;
};

export type TabsProps<T extends TabsOption = TabsOption> = {
  modelValue?: string;
  tabs: T[];
  pt?: PT<TabsPassthrough<T>>;
};

export type TabsEmits = {
  "update:modelValue": [value: string];
};

export type TabsContext<T extends TabsOption = TabsOption> = {
  tabs: T[];
  modelValue: Ref<string | undefined>;
  el: ComponentPublicInstance | null;
  settings: TabsPassthrough<T>;
};

export type TabsSlots<T extends TabsOption = TabsOption> = {
  list?: (props: TabsContext<T>) => VNode[];
  trigger?: (props: TabsContext<T> & { option: T }) => VNode[];
  triggerIcon?: (props: TabsContext<T> & { option: T }) => VNode[];
  content?: (props: TabsContext<T> & { option: T }) => VNode[];
};
