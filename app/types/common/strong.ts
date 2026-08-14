import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type StrongProps = {
  label?: string;
  modifiers?: ModifierProps<"strong">;
  tokens?: TokenProps<"strong">;
  aria?: AriaProps<"strong">;
};

export type StrongEmits = {};

export type StrongBindings = Bindings<"strong">;

export type StrongContext = StrongProps & {
  bindings: StrongBindings;
  el: HTMLElement | null;
};

export type StrongSlots = {
  default(props: StrongContext): VNode[];
};
