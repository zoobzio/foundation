import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type H5Props = {
  label?: string;
  modifiers?: ModifierProps<"h5">;
  tokens?: TokenProps<"h5">;
  aria?: AriaProps<"h5">;
};

export type H5Bindings = Bindings<"h5">;

export type H5Context = H5Props & {
  bindings: H5Bindings;
  el: HTMLHeadingElement | null;
};

export type H5Slots = {
  default(props: { ctx: H5Context }): VNode[];
};
