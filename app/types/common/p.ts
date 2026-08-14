import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type PProps = {
  label?: string;
  modifiers?: ModifierProps<"p">;
  tokens?: TokenProps<"p">;
  aria?: AriaProps<"p">;
};

export type PEmits = {};

export type PBindings = Bindings<"p">;

export type PContext = PProps & {
  bindings: PBindings;
  el: HTMLParagraphElement | null;
};

export type PSlots = {
  default(props: PContext): VNode[];
};
