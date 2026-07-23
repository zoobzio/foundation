import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type H4Props = {
  label?: string;
  modifiers?: ModifierProps<"h4">;
  tokens?: TokenProps<"h4">;
  aria?: AriaProps<"h4">;
};

export type H4Bindings = Bindings<"h4">;

export type H4Context = H4Props & {
  bindings: H4Bindings;
  el: HTMLHeadingElement | null;
};

export type H4Slots = {
  default(props: { ctx: H4Context }): VNode[];
};
