import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { Reshape } from "../../reshape";
import type { TokenProps } from "../../tokens";
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
