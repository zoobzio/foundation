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

export type TooltipPassthrough = {
  root: Passthrough<TooltipRootProps, TooltipRootEmits>;
  trigger: Passthrough<TooltipTriggerProps>;
  content: Passthrough<TooltipContentProps, TooltipContentEmits>;
};

export type TooltipProps = {
  content?: string;
  open?: boolean;
  delayDuration?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  pt?: PT<TooltipPassthrough>;
};

export type TooltipEmits = {
  "update:open": [value: boolean];
};

export type TooltipContext = {
  content?: string;
  delayDuration: number;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: TooltipPassthrough;
};

export type TooltipSlots = {
  default?: (props: TooltipContext) => VNode[];
  trigger?: (props: TooltipContext) => VNode[];
  content?: (props: TooltipContext) => VNode[];
};

/**
 * A tooltip instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type TooltipDefinition = Definition<TooltipProps, TooltipEmits>;
