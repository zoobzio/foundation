import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type MainProps = {
  label?: string;
  modifiers?: ModifierProps<"main">;
  tokens?: TokenProps<"main">;
  aria?: AriaProps<"main">;
};

export type MainEmits = ComponentEvents["main"];

export type MainBindings = Bindings<"main">;

export type MainContext = MainProps & {
  bindings: MainBindings;
  el: HTMLElement | null;
};

export type MainSlots = {
  default(props: MainContext): VNode[];
};
