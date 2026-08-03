import type { Reshape } from "#foundation/types/reshape";
import type { VNode } from "vue";
import type { SelectPortalProps as RekaSelectPortalProps } from "reka-ui";

export type SelectPortalProps = RekaSelectPortalProps;

export type SelectPortalContext = Reshape<SelectPortalProps>;

export type SelectPortalSlots = {
  default(props: SelectPortalContext): VNode[];
};
