import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type CardProps = {
  label?: string;
  modifiers?: ModifierProps<"card">;
  tokens?: TokenProps<"card">;
  aria?: AriaProps<"card">;
};

export type CardBindings = Bindings<"card">;

export type CardContext = CardProps & {
  bindings: CardBindings;
  el: HTMLDivElement | null;
};

export type CardSlots = {
  default(props: { ctx: CardContext }): VNode[];
};
