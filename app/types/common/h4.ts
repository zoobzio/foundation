import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type H4Props = {
  label?: string;
  modifiers?: ModifierProps<"h4">;
  tokens?: TokenProps<"h4">;
  aria?: AriaProps<"h4">;
};

export type H4Emits = {};

export type H4Bindings = Bindings<"h4">;

export type H4Context = H4Props & {
  bindings: H4Bindings;
  el: HTMLHeadingElement | null;
};

export type H4Slots = {
  default(props: H4Context): VNode[];
};
