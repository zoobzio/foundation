import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { Reshape } from "#foundation/types/reshape";
import type { TokenProps } from "#foundation/types/tokens";
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

export type DialogDescriptionEmits = ComponentEvents["dialog-description"];

export type DialogDescriptionBindings = Bindings<"dialog-description", DialogDescriptionForward>;

export type DialogDescriptionContext = Reshape<DialogDescriptionProps> & {
  bindings: DialogDescriptionBindings;
  el: ComponentPublicInstance | null;
};

export type DialogDescriptionSlots = {
  default(props: DialogDescriptionContext): VNode[];
};
