import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type CardProps = {
  label?: string;
  modifiers?: ModifierProps<"card">;
  tokens?: TokenProps<"card">;
  aria?: AriaProps<"card">;
};

export type CardEmits = {};

export type CardBindings = Bindings<"card">;

export type CardContext = CardProps & {
  bindings: CardBindings;
  el: HTMLDivElement | null;
};

export type CardSlots = {
  default(props: CardContext): VNode[];
};
