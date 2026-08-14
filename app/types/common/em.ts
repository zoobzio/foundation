import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type EmProps = {
  label?: string;
  modifiers?: ModifierProps<"em">;
  tokens?: TokenProps<"em">;
  aria?: AriaProps<"em">;
};

export type EmEmits = {};

export type EmBindings = Bindings<"em">;

export type EmContext = EmProps & {
  bindings: EmBindings;
  el: HTMLElement | null;
};

export type EmSlots = {
  default(props: EmContext): VNode[];
};
