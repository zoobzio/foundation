import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type HeaderProps = {
  label?: string;
  modifiers?: ModifierProps<"header">;
  tokens?: TokenProps<"header">;
  aria?: AriaProps<"header">;
};

export type HeaderEmits = {};

export type HeaderBindings = Bindings<"header">;

export type HeaderContext = HeaderProps & {
  bindings: HeaderBindings;
  el: HTMLElement | null;
};

export type HeaderSlots = {
  default(props: HeaderContext): VNode[];
};
