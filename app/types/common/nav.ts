import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type NavProps = {
  label?: string;
  modifiers?: ModifierProps<"nav">;
  tokens?: TokenProps<"nav">;
  aria?: AriaProps<"nav">;
};

export type NavBindings = Bindings<"nav">;

export type NavContext = NavProps & {
  bindings: NavBindings;
  el: HTMLElement | null;
};

export type NavSlots = {
  default(props: { ctx: NavContext }): VNode[];
};
