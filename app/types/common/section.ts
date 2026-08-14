import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type SectionProps = {
  label?: string;
  modifiers?: ModifierProps<"section">;
  tokens?: TokenProps<"section">;
  aria?: AriaProps<"section">;
};

export type SectionEmits = {};

export type SectionBindings = Bindings<"section">;

export type SectionContext = SectionProps & {
  bindings: SectionBindings;
  el: HTMLElement | null;
};

export type SectionSlots = {
  default(props: SectionContext): VNode[];
};
