import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type H6Props = {
  label?: string;
  modifiers?: ModifierProps<"h6">;
  tokens?: TokenProps<"h6">;
  aria?: AriaProps<"h6">;
};

export type H6Emits = ComponentEvents["h6"];

export type H6Bindings = Bindings<"h6">;

export type H6Context = H6Props & {
  bindings: H6Bindings;
  el: HTMLHeadingElement | null;
};

export type H6Slots = {
  default(props: H6Context): VNode[];
};
