import type {
  TooltipRootProps,
  TooltipRootEmits,
} from "#foundation/types/common/tooltip/root";
import type { TooltipTriggerProps } from "#foundation/types/common/tooltip/trigger";
import type {
  TooltipContentProps,
  TooltipContentEmits,
} from "#foundation/types/common/tooltip/content";
import type { ComponentEvents } from "#foundation/types/events";
import type { Passthrough, PT } from "#foundation/types/passthrough";
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

export type TooltipEmits = ComponentEvents["tooltip"] & {
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
