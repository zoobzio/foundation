import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type CaptionProps = {
  label?: string;
  modifiers?: ModifierProps<"caption">;
  tokens?: TokenProps<"caption">;
  aria?: AriaProps<"caption">;
};

export type CaptionBindings = Bindings<"caption">;

export type CaptionContext = CaptionProps & {
  bindings: CaptionBindings;
  el: HTMLDivElement | null;
};

export type CaptionSlots = {
  default(props: { ctx: CaptionContext }): VNode[];
};
