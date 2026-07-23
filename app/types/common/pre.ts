import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type PreProps = {
  label?: string;
  modifiers?: ModifierProps<"pre">;
  tokens?: TokenProps<"pre">;
  aria?: AriaProps<"pre">;
};

export type PreBindings = Bindings<"pre">;

export type PreContext = PreProps & {
  bindings: PreBindings;
  el: HTMLPreElement | null;
};

export type PreSlots = {
  default(props: { ctx: PreContext }): VNode[];
};
