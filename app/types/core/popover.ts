import type {
  PopoverRootProps,
  PopoverRootEmits,
} from "#foundation/types/common/popover/root";
import type {
  PopoverAnchorProps,
  ReferenceElement,
} from "#foundation/types/common/popover/anchor";
import type { PopoverTriggerProps } from "#foundation/types/common/popover/trigger";
import type {
  PopoverContentProps,
  PopoverContentEmits,
} from "#foundation/types/common/popover/content";
import type { PopoverArrowProps } from "#foundation/types/common/popover/arrow";
import type { PopoverCloseProps } from "#foundation/types/common/popover/close";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
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

export type PopoverEmits = ComponentEvents["popover"] & {
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
