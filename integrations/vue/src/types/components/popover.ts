import type {
  PopoverRootProps,
  PopoverRootEmits,
  PopoverAnchorProps,
  ReferenceElement,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverContentEmits,
  PopoverArrowProps,
  PopoverCloseProps,
} from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * The parts of the popover that accept passthrough.
 */
export type PopoverPassthrough = {
  root: Passthrough<PopoverRootProps, PopoverRootEmits>;
  anchor: Passthrough<PopoverAnchorProps>;
  trigger: Passthrough<PopoverTriggerProps>;
  content: Passthrough<PopoverContentProps, PopoverContentEmits>;
  arrow: Passthrough<PopoverArrowProps>;
  close: Passthrough<PopoverCloseProps>;
};

/**
 * Props of the popover. `reference` positions the content against an
 * external element instead of the trigger.
 */
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

/**
 * Emits of the popover.
 */
export type PopoverEmits = {
  "update:open": [value: boolean];
};

/**
 * The popover view model, served to `defineExpose` and the slots.
 */
export type PopoverContext = {
  defaultOpen: boolean;
  modal: boolean;
  reference?: ReferenceElement;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  alignOffset: number;
  arrow: boolean;
  open: Ref<boolean>;
  el: ComponentPublicInstance | null;
  settings: PopoverPassthrough;
};

/**
 * Slots of the popover. Each slot receives the context.
 */
export type PopoverSlots = {
  anchor?: (props: PopoverContext) => VNode[];
  trigger?: (props: PopoverContext) => VNode[];
  content?: (props: PopoverContext) => VNode[];
  arrow?: (props: PopoverContext) => VNode[];
  close?: (props: PopoverContext) => VNode[];
};

/**
 * A popover instance as data: props plus emit listeners.
 */
export type PopoverDefinition = Definition<PopoverProps, PopoverEmits>;
