import type {
  PopoverRootProps,
  PopoverRootEmits,
} from "../common/popover/root";
import type {
  PopoverAnchorProps,
  ReferenceElement,
} from "../common/popover/anchor";
import type { PopoverTriggerProps } from "../common/popover/trigger";
import type {
  PopoverContentProps,
  PopoverContentEmits,
} from "../common/popover/content";
import type { PopoverArrowProps } from "../common/popover/arrow";
import type { PopoverCloseProps } from "../common/popover/close";
import type { Passthrough, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

export type PopoverPassthrough = {
  root: Passthrough<PopoverRootProps, PopoverRootEmits>;
  anchor: Passthrough<PopoverAnchorProps>;
  trigger: Passthrough<PopoverTriggerProps>;
  content: Passthrough<PopoverContentProps, PopoverContentEmits>;
  arrow: Passthrough<PopoverArrowProps>;
  close: Passthrough<PopoverCloseProps>;
};

export type PopoverProps = {
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  reference?: ReferenceElement;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  arrow?: boolean;
  pt?: PT<PopoverPassthrough>;
};

export type PopoverEmits = {
  "update:open": [value: boolean];
};

export type PopoverContext = {
  defaultOpen: boolean;
  modal: boolean;
  reference?: ReferenceElement;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  alignOffset: number;
  arrow: boolean;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: PopoverPassthrough;
};

export type PopoverSlots = {
  anchor?: (props: PopoverContext) => VNode[];
  trigger?: (props: PopoverContext) => VNode[];
  content?: (props: PopoverContext) => VNode[];
  arrow?: (props: PopoverContext) => VNode[];
  close?: (props: PopoverContext) => VNode[];
};
