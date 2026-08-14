import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type H2Props = {
  label?: string;
  modifiers?: ModifierProps<"h2">;
  tokens?: TokenProps<"h2">;
  aria?: AriaProps<"h2">;
};

export type H2Emits = ComponentEvents["h2"];

export type H2Bindings = Bindings<"h2">;

export type H2Context = H2Props & {
  bindings: H2Bindings;
  el: HTMLHeadingElement | null;
};

export type H2Slots = {
  default(props: H2Context): VNode[];
};
