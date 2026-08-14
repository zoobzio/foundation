import type { Reshape } from "../../reshape";
import type { VNode } from "vue";
import type { PopoverPortalProps as RekaPopoverPortalProps } from "reka-ui";

export type PopoverPortalProps = RekaPopoverPortalProps;

export type PopoverPortalContext = Reshape<PopoverPortalProps>;

export type PopoverPortalSlots = {
  default(props: PopoverPortalContext): VNode[];
};
