import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type OlProps = {
  modifiers?: ModifierProps<"ol">;
  tokens?: TokenProps<"ol">;
  aria?: AriaProps<"ol">;
};

export type OlEmits = {};

export type OlBindings = Bindings<"ol">;

export type OlContext = OlProps & {
  bindings: OlBindings;
  el: HTMLOListElement | null;
};

export type OlSlots = {
  default(props: OlContext): VNode[];
};
