import type { Reshape } from "../../reshape";
import type { VNode } from "vue";
import type { TooltipProviderProps as RekaTooltipProviderProps } from "reka-ui";

export type TooltipProviderProps = RekaTooltipProviderProps;

export type TooltipProviderContext = Reshape<TooltipProviderProps>;

export type TooltipProviderSlots = {
  default(props: TooltipProviderContext): VNode[];
};
