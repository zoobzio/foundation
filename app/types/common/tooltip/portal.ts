import type { Reshape } from "../../reshape";
import type { VNode } from "vue";
import type { TooltipPortalProps as RekaTooltipPortalProps } from "reka-ui";

export type TooltipPortalProps = RekaTooltipPortalProps;

export type TooltipPortalContext = Reshape<TooltipPortalProps>;

export type TooltipPortalSlots = {
  default(props: TooltipPortalContext): VNode[];
};
