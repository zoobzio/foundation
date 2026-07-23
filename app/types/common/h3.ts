import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type H3Props = {
  label?: string;
  modifiers?: ModifierProps<"h3">;
  tokens?: TokenProps<"h3">;
  aria?: AriaProps<"h3">;
};

export type H3Bindings = Bindings<"h3">;

export type H3Context = H3Props & {
  bindings: H3Bindings;
  el: HTMLHeadingElement | null;
};

export type H3Slots = {
  default(props: { ctx: H3Context }): VNode[];
};
