import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type H1Props = {
  label?: string;
  modifiers?: ModifierProps<"h1">;
  tokens?: TokenProps<"h1">;
  aria?: AriaProps<"h1">;
};

export type H1Emits = ComponentEvents["h1"];

export type H1Bindings = Bindings<"h1">;

export type H1Context = H1Props & {
  bindings: H1Bindings;
  el: HTMLHeadingElement | null;
};

export type H1Slots = {
  default(props: H1Context): VNode[];
};
