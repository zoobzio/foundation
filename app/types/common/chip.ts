import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type ChipProps = {
  label?: string;
  disabled?: boolean;
  modifiers?: ModifierProps<"chip">;
  tokens?: TokenProps<"chip">;
  aria?: AriaProps<"chip">;
};

export type ChipBindings = Bindings<"chip">;

export type ChipContext = ChipProps & {
  bindings: ChipBindings;
  el: HTMLButtonElement | null;
};

export type ChipSlots = {
  default(props: { ctx: ChipContext }): VNode[];
};
