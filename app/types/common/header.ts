import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type HeaderProps = {
  label?: string;
  modifiers?: ModifierProps<"header">;
  tokens?: TokenProps<"header">;
  aria?: AriaProps<"header">;
};

export type HeaderBindings = Bindings<"header">;

export type HeaderContext = HeaderProps & {
  bindings: HeaderBindings;
  el: HTMLElement | null;
};

export type HeaderSlots = {
  default(props: { ctx: HeaderContext }): VNode[];
};
