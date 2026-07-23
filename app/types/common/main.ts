import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type MainProps = {
  label?: string;
  modifiers?: ModifierProps<"main">;
  tokens?: TokenProps<"main">;
  aria?: AriaProps<"main">;
};

export type MainBindings = Bindings<"main">;

export type MainContext = MainProps & {
  bindings: MainBindings;
  el: HTMLElement | null;
};

export type MainSlots = {
  default(props: { ctx: MainContext }): VNode[];
};
