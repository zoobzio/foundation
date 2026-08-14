import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type H3Props = {
  label?: string;
  modifiers?: ModifierProps<"h3">;
  tokens?: TokenProps<"h3">;
  aria?: AriaProps<"h3">;
};

export type H3Emits = ComponentEvents["h3"];

export type H3Bindings = Bindings<"h3">;

export type H3Context = H3Props & {
  bindings: H3Bindings;
  el: HTMLHeadingElement | null;
};

export type H3Slots = {
  default(props: H3Context): VNode[];
};
