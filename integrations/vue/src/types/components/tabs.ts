import type {
  TabsRootProps,
  TabsRootEmits,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "reka-ui";
import type { LinkProps, LinkTarget, Option } from "../common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * A tab. With `link`, the trigger renders as an anchor and navigates on
 * activation. A linked tab switches the root to manual activation: arrow
 * keys move focus only, and click or Enter changes the active tab.
 */
export interface TabsOption extends Option {
  link?: LinkTarget;
}

/**
 * The parts of the tabs that accept passthrough. `link` is the anchor a
 * linked trigger renders as child, built per tab.
 */
export type TabsPassthrough<T extends TabsOption = TabsOption> = {
  root: Passthrough<TabsRootProps, TabsRootEmits>;
  list: Passthrough<TabsListProps>;
  trigger: PassthroughIter<T, TabsTriggerProps>;
  link: PassthroughIter<T, LinkProps>;
  content: PassthroughIter<T, TabsContentProps>;
};

/**
 * Props of the tabs. `modelValue` is the active tab value.
 */
export type TabsProps<T extends TabsOption = TabsOption> = {
  modelValue?: string;
  tabs: T[];
  pt?: PT<TabsPassthrough<T>>;
};

/**
 * Emits of the tabs.
 */
export type TabsEmits = {
  "update:modelValue": [value: string];
};

/**
 * The tabs view model, served to `defineExpose` and the slots.
 */
export type TabsContext<T extends TabsOption = TabsOption> = {
  tabs: T[];
  modelValue: Ref<string | undefined>;
  el: ComponentPublicInstance | null;
  settings: TabsPassthrough<T>;
};

/**
 * Slots of the tabs. Each slot receives the context.
 * Trigger and content slots also receive the `option`.
 */
export type TabsSlots<T extends TabsOption = TabsOption> = {
  list?: (props: TabsContext<T>) => VNode[];
  trigger?: (props: TabsContext<T> & { option: T }) => VNode[];
  content?: (props: TabsContext<T> & { option: T }) => VNode[];
  triggerPrepend?: (props: TabsContext<T> & { option: T }) => VNode[];
  triggerAppend?: (props: TabsContext<T> & { option: T }) => VNode[];
};

/**
 * A tabs instance as data: props plus emit listeners.
 */
export type TabsDefinition<T extends TabsOption = TabsOption> = Definition<
  TabsProps<T>,
  TabsEmits
>;
