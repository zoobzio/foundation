import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type KbdProps = {
  label?: string;
  modifiers?: ModifierProps<"kbd">;
  tokens?: TokenProps<"kbd">;
  aria?: AriaProps<"kbd">;
};

export type KbdBindings = Bindings<"kbd">;

export type KbdContext = KbdProps & {
  bindings: KbdBindings;
  el: HTMLElement | null;
};

export type KbdSlots = {
  default(props: { ctx: KbdContext }): VNode[];
};
