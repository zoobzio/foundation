import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type AlertProps = {
  label?: string;
  modifiers?: ModifierProps<"alert">;
  tokens?: TokenProps<"alert">;
  aria?: AriaProps<"alert">;
};

export type AlertBindings = Bindings<"alert">;

export type AlertContext = AlertProps & {
  bindings: AlertBindings;
  el: HTMLDivElement | null;
};

export type AlertSlots = {
  default(props: { ctx: AlertContext }): VNode[];
};
