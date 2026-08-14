import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { Reshape } from "../../reshape";
import type { TokenProps } from "../../tokens";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DialogOverlayProps as RekaDialogOverlayProps,
} from "reka-ui";

export type DialogOverlayForward = Reshape<RekaDialogOverlayProps>;

export type DialogOverlayProps = RekaDialogOverlayProps & {
  modifiers?: ModifierProps<"dialog-overlay">;
  tokens?: TokenProps<"dialog-overlay">;
  aria?: AriaProps<"dialog-overlay">;
};

export type DialogOverlayEmits = {};

export type DialogOverlayBindings = Bindings<"dialog-overlay", DialogOverlayForward>;

export type DialogOverlayContext = Reshape<DialogOverlayProps> & {
  bindings: DialogOverlayBindings;
  el: ComponentPublicInstance | null;
};

export type DialogOverlaySlots = {
  default(props: DialogOverlayContext): VNode[];
};
