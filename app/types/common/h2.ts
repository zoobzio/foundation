import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type H2Props = {
  label?: string;
  modifiers?: ModifierProps<"h2">;
  tokens?: TokenProps<"h2">;
  aria?: AriaProps<"h2">;
};

export type H2Bindings = Bindings<"h2">;

export type H2Context = H2Props & {
  bindings: H2Bindings;
  el: HTMLHeadingElement | null;
};

export type H2Slots = {
  default(props: { ctx: H2Context }): VNode[];
};
