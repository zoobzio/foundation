import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type AsideProps = {
  label?: string;
  modifiers?: ModifierProps<"aside">;
  tokens?: TokenProps<"aside">;
  aria?: AriaProps<"aside">;
};

export type AsideEmits = {};

export type AsideBindings = Bindings<"aside">;

export type AsideContext = AsideProps & {
  bindings: AsideBindings;
  el: HTMLElement | null;
};

export type AsideSlots = {
  default(props: AsideContext): VNode[];
};
