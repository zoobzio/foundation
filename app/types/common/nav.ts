import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type NavProps = {
  label?: string;
  modifiers?: ModifierProps<"nav">;
  tokens?: TokenProps<"nav">;
  aria?: AriaProps<"nav">;
};

export type NavEmits = {};

export type NavBindings = Bindings<"nav">;

export type NavContext = NavProps & {
  bindings: NavBindings;
  el: HTMLElement | null;
};

export type NavSlots = {
  default(props: NavContext): VNode[];
};
