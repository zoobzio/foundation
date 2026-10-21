import type {
  TooltipRootProps,
  TooltipRootEmits,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipContentEmits,
} from "reka-ui";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * The parts of the tooltip that accept passthrough.
 */
export type TooltipPassthrough = {
  root: Passthrough<TooltipRootProps, TooltipRootEmits>;
  trigger: Passthrough<TooltipTriggerProps>;
  content: Passthrough<TooltipContentProps, TooltipContentEmits>;
};

/**
 * Props of the tooltip. `delayDuration` is in milliseconds.
 */
export type TooltipProps = {
  content?: string;
  open?: boolean;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  pt?: PT<TooltipPassthrough>;
};

/**
 * Emits of the tooltip.
 */
export type TooltipEmits = {
  "update:open": [value: boolean];
};

/**
 * The tooltip view model, served to `defineExpose` and the slots.
 */
export type TooltipContext = {
  content?: string;
  delayDuration: number;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  open: Ref<boolean>;
  el: ComponentPublicInstance | null;
  settings: TooltipPassthrough;
};

/**
 * Slots of the tooltip. Each slot receives the context.
 * The default slot is the trigger content.
 */
export type TooltipSlots = {
  default?: (props: TooltipContext) => VNode[];
  trigger?: (props: TooltipContext) => VNode[];
  content?: (props: TooltipContext) => VNode[];
};

/**
 * A tooltip instance as data: props plus emit listeners.
 */
export type TooltipDefinition = Definition<TooltipProps, TooltipEmits>;
