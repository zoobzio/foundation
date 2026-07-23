import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type EmProps = {
  label?: string;
  modifiers?: ModifierProps<"em">;
  tokens?: TokenProps<"em">;
  aria?: AriaProps<"em">;
};

export type EmBindings = Bindings<"em">;

export type EmContext = EmProps & {
  bindings: EmBindings;
  el: HTMLElement | null;
};

export type EmSlots = {
  default(props: { ctx: EmContext }): VNode[];
};
