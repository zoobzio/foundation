import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type AsideProps = {
  label?: string;
  modifiers?: ModifierProps<"aside">;
  tokens?: TokenProps<"aside">;
  aria?: AriaProps<"aside">;
};

export type AsideBindings = Bindings<"aside">;

export type AsideContext = AsideProps & {
  bindings: AsideBindings;
  el: HTMLElement | null;
};

export type AsideSlots = {
  default(props: { ctx: AsideContext }): VNode[];
};
