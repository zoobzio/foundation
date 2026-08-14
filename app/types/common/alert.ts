import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type AlertProps = {
  label?: string;
  modifiers?: ModifierProps<"alert">;
  tokens?: TokenProps<"alert">;
  aria?: AriaProps<"alert">;
};

export type AlertEmits = ComponentEvents["alert"];

export type AlertBindings = Bindings<"alert">;

export type AlertContext = AlertProps & {
  bindings: AlertBindings;
  el: HTMLDivElement | null;
};

export type AlertSlots = {
  default(props: AlertContext): VNode[];
};
