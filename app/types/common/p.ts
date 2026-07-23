import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type PProps = {
  label?: string;
  modifiers?: ModifierProps<"p">;
  tokens?: TokenProps<"p">;
  aria?: AriaProps<"p">;
};

export type PBindings = Bindings<"p">;

export type PContext = PProps & {
  bindings: PBindings;
  el: HTMLParagraphElement | null;
};

export type PSlots = {
  default(props: { ctx: PContext }): VNode[];
};
