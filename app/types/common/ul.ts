import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type UlProps = {
  modifiers?: ModifierProps<"ul">;
  tokens?: TokenProps<"ul">;
  aria?: AriaProps<"ul">;
};

export type UlBindings = Bindings<"ul">;

export type UlContext = UlProps & {
  bindings: UlBindings;
  el: HTMLUListElement | null;
};

export type UlSlots = {
  default(props: { ctx: UlContext }): VNode[];
};
