import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { Reshape } from "#foundation/types/reshape";
import type { TokenProps } from "#foundation/types/tokens";
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

export type DialogOverlayEmits = ComponentEvents["dialog-overlay"];

export type DialogOverlayBindings = Bindings<"dialog-overlay", DialogOverlayForward>;

export type DialogOverlayContext = Reshape<DialogOverlayProps> & {
  bindings: DialogOverlayBindings;
  el: ComponentPublicInstance | null;
};

export type DialogOverlaySlots = {
  default(props: DialogOverlayContext): VNode[];
};
