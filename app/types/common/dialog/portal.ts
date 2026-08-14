import type { Reshape } from "../../reshape";
import type { VNode } from "vue";
import type { DialogPortalProps as RekaDialogPortalProps } from "reka-ui";

export type DialogPortalProps = RekaDialogPortalProps;

export type DialogPortalContext = Reshape<DialogPortalProps>;

export type DialogPortalSlots = {
  default(props: DialogPortalContext): VNode[];
};
