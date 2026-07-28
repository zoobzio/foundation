import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { Reshape } from "#foundation/types/reshape";
import type { TokenProps } from "#foundation/types/tokens";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DialogContentEmits as RekaDialogContentEmits,
  DialogContentProps as RekaDialogContentProps,
} from "reka-ui";

export type DialogContentForward = Reshape<RekaDialogContentProps>;

export type DialogContentProps = RekaDialogContentProps & {
  modifiers?: ModifierProps<"dialog-content">;
  tokens?: TokenProps<"dialog-content">;
  aria?: AriaProps<"dialog-content">;
};

export type DialogContentEmits = RekaDialogContentEmits & ComponentEvents["dialog-content"];

export type DialogContentBindings = Bindings<"dialog-content", DialogContentForward>;

export type DialogContentContext = Reshape<DialogContentProps> & {
  bindings: DialogContentBindings;
  el: ComponentPublicInstance | null;
};

export type DialogContentSlots = {
  default(props: DialogContentContext): VNode[];
};
