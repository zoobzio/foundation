import type {
  AccordionRootProps,
  AccordionRootEmits,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "reka-ui";
import type { Option } from "../common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * The parts of the accordion that accept passthrough.
 */
export type AccordionPassthrough<T extends Option = Option> = {
  root: Passthrough<AccordionRootProps, AccordionRootEmits>;
  item: PassthroughIter<T, AccordionItemProps>;
  header: Passthrough<AccordionHeaderProps>;
  trigger: Passthrough<AccordionTriggerProps>;
  content: Passthrough<AccordionContentProps>;
};

/**
 * Props of the accordion. `modelValue` is the open item value, or the open
 * values when `type` is `multiple`.
 */
export type AccordionProps<T extends Option = Option> = {
  items: T[];
  modelValue?: string | string[];
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  pt?: PT<AccordionPassthrough<T>>;
};

/**
 * Emits of the accordion.
 */
export type AccordionEmits = {
  "update:modelValue": [value: string | string[] | undefined];
};

/**
 * The accordion view model, served to `defineExpose` and the slots.
 */
export type AccordionContext<T extends Option = Option> = {
  items: T[];
  type: "single" | "multiple";
  collapsible: boolean;
  defaultValue?: string | string[];
  modelValue: Ref<string | string[] | undefined>;
  el: ComponentPublicInstance | null;
  settings: AccordionPassthrough<T>;
};

/**
 * Slots of the accordion. Each slot receives the context, the `item`, and its
 * `open` state.
 */
export type AccordionSlots<T extends Option = Option> = {
  item?: (props: AccordionContext<T> & { item: T; open: boolean }) => VNode[];
  header?: (props: AccordionContext<T> & { item: T; open: boolean }) => VNode[];
  trigger?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
  triggerContent?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
  chevron?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
  content?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
  triggerPrepend?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
  triggerAppend?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
};

/**
 * An accordion instance as data: props plus emit listeners.
 */
export type AccordionDefinition<T extends Option = Option> = Definition<
  AccordionProps<T>,
  AccordionEmits
>;
