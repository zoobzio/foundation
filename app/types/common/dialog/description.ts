import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { Reshape } from "../../reshape";
import type { TokenProps } from "../../tokens";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DialogDescriptionProps as RekaDialogDescriptionProps,
} from "reka-ui";

export type DialogDescriptionForward = Reshape<RekaDialogDescriptionProps>;

export type DialogDescriptionProps = RekaDialogDescriptionProps & {
  modifiers?: ModifierProps<"dialog-description">;
  tokens?: TokenProps<"dialog-description">;
  aria?: AriaProps<"dialog-description">;
};

export type DialogDescriptionEmits = {};

export type DialogDescriptionBindings = Bindings<"dialog-description", DialogDescriptionForward>;

export type DialogDescriptionContext = Reshape<DialogDescriptionProps> & {
  bindings: DialogDescriptionBindings;
  el: ComponentPublicInstance | null;
};

export type DialogDescriptionSlots = {
  default(props: DialogDescriptionContext): VNode[];
};
