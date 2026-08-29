import type {
  AccordionRootProps,
  AccordionRootEmits,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "reka-ui";
import type { Option } from "./common";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type AccordionPassthrough = {
  root: Passthrough<AccordionRootProps, AccordionRootEmits>;
  item: PassthroughIter<Option, AccordionItemProps>;
  header: Passthrough<AccordionHeaderProps>;
  trigger: Passthrough<AccordionTriggerProps>;
  content: Passthrough<AccordionContentProps>;
};

export type AccordionProps = {
  items: Option[];
  modelValue?: string | string[];
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  pt?: PT<AccordionPassthrough>;
};

export type AccordionEmits = {
  "update:modelValue": [value: string | string[] | undefined];
};

export type AccordionContext = {
  items: Option[];
  type: "single" | "multiple";
  collapsible: boolean;
  defaultValue?: string | string[];
  modelValue: Ref<string | string[] | undefined>;
  el: ComponentPublicInstance | null;
  settings: AccordionPassthrough;
};

export type AccordionSlots = {
  item?: (props: AccordionContext & { item: Option; open: boolean }) => VNode[];
  header?: (props: AccordionContext & { item: Option; open: boolean }) => VNode[];
  trigger?: (props: AccordionContext & { item: Option; open: boolean }) => VNode[];
  triggerContent?: (
    props: AccordionContext & { item: Option; open: boolean },
  ) => VNode[];
  chevron?: (props: AccordionContext & { item: Option; open: boolean }) => VNode[];
  content?: (props: AccordionContext & { item: Option; open: boolean }) => VNode[];
};
