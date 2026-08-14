import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type DelProps = {
  label?: string;
  modifiers?: ModifierProps<"del">;
  tokens?: TokenProps<"del">;
  aria?: AriaProps<"del">;
};

export type DelEmits = {};

export type DelBindings = Bindings<"del">;

export type DelContext = DelProps & {
  bindings: DelBindings;
  el: HTMLModElement | null;
};

export type DelSlots = {
  default(props: DelContext): VNode[];
};
