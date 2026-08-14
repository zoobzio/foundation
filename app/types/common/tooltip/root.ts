import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  TooltipRootEmits as RekaTooltipRootEmits,
  TooltipRootProps as RekaTooltipRootProps,
} from "reka-ui";

export type TooltipRootProps = RekaTooltipRootProps;

export type TooltipRootEmits = RekaTooltipRootEmits;

export type TooltipRootContext = Reshape<TooltipRootProps, "open"> & {
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
};

export type TooltipRootSlots = {
  default(props: TooltipRootContext): VNode[];
};
