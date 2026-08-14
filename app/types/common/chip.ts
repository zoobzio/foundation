import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { EventEmits } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type ChipProps = {
  label?: string;
  disabled?: boolean;
  modifiers?: ModifierProps<"chip">;
  tokens?: TokenProps<"chip">;
  aria?: AriaProps<"chip">;
};

export type ChipEmits = EventEmits<"click">;

export type ChipBindings = Bindings<"chip">;

export type ChipContext = ChipProps & {
  bindings: ChipBindings;
  el: HTMLButtonElement | null;
};

export type ChipSlots = {
  default(props: ChipContext): VNode[];
};
