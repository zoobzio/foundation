import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
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
