import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { Reshape } from "#foundation/types/reshape";
import type { TokenProps } from "#foundation/types/tokens";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  DialogTitleProps as RekaDialogTitleProps,
} from "reka-ui";

export type DialogTitleForward = Reshape<RekaDialogTitleProps>;

export type DialogTitleProps = RekaDialogTitleProps & {
  modifiers?: ModifierProps<"dialog-title">;
  tokens?: TokenProps<"dialog-title">;
  aria?: AriaProps<"dialog-title">;
};

export type DialogTitleEmits = ComponentEvents["dialog-title"];

export type DialogTitleBindings = Bindings<"dialog-title", DialogTitleForward>;

export type DialogTitleContext = Reshape<DialogTitleProps> & {
  bindings: DialogTitleBindings;
  el: ComponentPublicInstance | null;
};

export type DialogTitleSlots = {
  default(props: DialogTitleContext): VNode[];
};
