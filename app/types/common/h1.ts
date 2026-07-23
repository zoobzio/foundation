import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type H1Props = {
  label?: string;
  modifiers?: ModifierProps<"h1">;
  tokens?: TokenProps<"h1">;
  aria?: AriaProps<"h1">;
};

export type H1Bindings = Bindings<"h1">;

export type H1Context = H1Props & {
  bindings: H1Bindings;
  el: HTMLHeadingElement | null;
};

export type H1Slots = {
  default(props: { ctx: H1Context }): VNode[];
};
