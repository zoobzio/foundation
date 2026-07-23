import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type H6Props = {
  label?: string;
  modifiers?: ModifierProps<"h6">;
  tokens?: TokenProps<"h6">;
  aria?: AriaProps<"h6">;
};

export type H6Bindings = Bindings<"h6">;

export type H6Context = H6Props & {
  bindings: H6Bindings;
  el: HTMLHeadingElement | null;
};

export type H6Slots = {
  default(props: { ctx: H6Context }): VNode[];
};
