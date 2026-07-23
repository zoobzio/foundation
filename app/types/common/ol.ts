import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type OlProps = {
  modifiers?: ModifierProps<"ol">;
  tokens?: TokenProps<"ol">;
  aria?: AriaProps<"ol">;
};

export type OlBindings = Bindings<"ol">;

export type OlContext = OlProps & {
  bindings: OlBindings;
  el: HTMLOListElement | null;
};

export type OlSlots = {
  default(props: { ctx: OlContext }): VNode[];
};
