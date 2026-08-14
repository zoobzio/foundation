import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type KbdProps = {
  label?: string;
  modifiers?: ModifierProps<"kbd">;
  tokens?: TokenProps<"kbd">;
  aria?: AriaProps<"kbd">;
};

export type KbdEmits = ComponentEvents["kbd"];

export type KbdBindings = Bindings<"kbd">;

export type KbdContext = KbdProps & {
  bindings: KbdBindings;
  el: HTMLElement | null;
};

export type KbdSlots = {
  default(props: KbdContext): VNode[];
};
