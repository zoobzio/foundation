import type { Reshape } from "../../reshape";
import type { VNode } from "vue";
import type { DropdownMenuPortalProps as RekaDropdownMenuPortalProps } from "reka-ui";

export type DropdownMenuPortalProps = RekaDropdownMenuPortalProps;

export type DropdownMenuPortalContext = Reshape<DropdownMenuPortalProps>;

export type DropdownMenuPortalSlots = {
  default(props: DropdownMenuPortalContext): VNode[];
};
