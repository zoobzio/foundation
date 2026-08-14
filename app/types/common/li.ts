import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type LiProps = {
  label?: string;
  modifiers?: ModifierProps<"li">;
  tokens?: TokenProps<"li">;
  aria?: AriaProps<"li">;
};

export type LiEmits = {};

export type LiBindings = Bindings<"li">;

export type LiContext = LiProps & {
  bindings: LiBindings;
  el: HTMLLIElement | null;
};

export type LiSlots = {
  default(props: LiContext): VNode[];
};
