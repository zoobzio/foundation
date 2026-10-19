import type {
  AccordionRootProps,
  AccordionRootEmits,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "reka-ui";
import type { Option } from "./common";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type AccordionPassthrough<T extends Option = Option> = {
  root: Passthrough<AccordionRootProps, AccordionRootEmits>;
  item: PassthroughIter<T, AccordionItemProps>;
  header: Passthrough<AccordionHeaderProps>;
  trigger: Passthrough<AccordionTriggerProps>;
  content: Passthrough<AccordionContentProps>;
};

export type AccordionProps<T extends Option = Option> = {
  items: T[];
  modelValue?: string | string[];
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  pt?: PT<AccordionPassthrough<T>>;
};

export type AccordionEmits = {
  "update:modelValue": [value: string | string[] | undefined];
};

export type AccordionContext<T extends Option = Option> = {
  items: T[];
  type: "single" | "multiple";
  collapsible: boolean;
  defaultValue?: string | string[];
  modelValue: Ref<string | string[] | undefined>;
  el: ComponentPublicInstance | null;
  settings: AccordionPassthrough<T>;
};

export type AccordionSlots<T extends Option = Option> = {
  item?: (props: AccordionContext<T> & { item: T; open: boolean }) => VNode[];
  header?: (props: AccordionContext<T> & { item: T; open: boolean }) => VNode[];
  trigger?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
  triggerContent?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
  triggerIcon?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
  chevron?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
  content?: (
    props: AccordionContext<T> & { item: T; open: boolean },
  ) => VNode[];
};
