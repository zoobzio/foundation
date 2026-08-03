import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type FooterProps = {
  label?: string;
  modifiers?: ModifierProps<"footer">;
  tokens?: TokenProps<"footer">;
  aria?: AriaProps<"footer">;
};

export type FooterEmits = ComponentEvents["footer"];

export type FooterBindings = Bindings<"footer">;

export type FooterContext = FooterProps & {
  bindings: FooterBindings;
  el: HTMLElement | null;
};

export type FooterSlots = {
  default(props: FooterContext): VNode[];
};
