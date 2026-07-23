import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type DelProps = {
  label?: string;
  modifiers?: ModifierProps<"del">;
  tokens?: TokenProps<"del">;
  aria?: AriaProps<"del">;
};

export type DelBindings = Bindings<"del">;

export type DelContext = DelProps & {
  bindings: DelBindings;
  el: HTMLModElement | null;
};

export type DelSlots = {
  default(props: { ctx: DelContext }): VNode[];
};
