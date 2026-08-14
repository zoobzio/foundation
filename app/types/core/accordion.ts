import type { GroupProps } from "../common/group";
import type { IconProps } from "../common/icon";
import type {
  AccordionRootProps,
  AccordionRootEmits,
} from "../common/accordion/root";
import type { AccordionItemProps } from "../common/accordion/item";
import type { AccordionHeaderProps } from "../common/accordion/header";
import type { AccordionTriggerProps } from "../common/accordion/trigger";
import type { AccordionContentProps } from "../common/accordion/content";
import type { Option } from "./common";
import type { ComponentEvents } from "../events";
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
  triggerContent: Passthrough<GroupProps>;
  triggerIcon: PassthroughIter<Option, IconProps>;
  chevron: PassthroughIter<boolean, IconProps>;
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

export type AccordionEmits = ComponentEvents["accordion"] & {
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
