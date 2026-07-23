import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type StrongProps = {
  label?: string;
  modifiers?: ModifierProps<"strong">;
  tokens?: TokenProps<"strong">;
  aria?: AriaProps<"strong">;
};

export type StrongBindings = Bindings<"strong">;

export type StrongContext = StrongProps & {
  bindings: StrongBindings;
  el: HTMLElement | null;
};

export type StrongSlots = {
  default(props: { ctx: StrongContext }): VNode[];
};
