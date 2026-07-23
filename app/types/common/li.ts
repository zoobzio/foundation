import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type LiProps = {
  label?: string;
  modifiers?: ModifierProps<"li">;
  tokens?: TokenProps<"li">;
  aria?: AriaProps<"li">;
};

export type LiBindings = Bindings<"li">;

export type LiContext = LiProps & {
  bindings: LiBindings;
  el: HTMLLIElement | null;
};

export type LiSlots = {
  default(props: { ctx: LiContext }): VNode[];
};
