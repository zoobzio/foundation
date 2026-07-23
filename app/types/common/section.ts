import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type SectionProps = {
  label?: string;
  modifiers?: ModifierProps<"section">;
  tokens?: TokenProps<"section">;
  aria?: AriaProps<"section">;
};

export type SectionBindings = Bindings<"section">;

export type SectionContext = SectionProps & {
  bindings: SectionBindings;
  el: HTMLElement | null;
};

export type SectionSlots = {
  default(props: { ctx: SectionContext }): VNode[];
};
