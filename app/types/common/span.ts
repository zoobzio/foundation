import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type SpanProps = {
  label?: string;
  modifiers?: ModifierProps<"span">;
  tokens?: TokenProps<"span">;
  aria?: AriaProps<"span">;
};

export type SpanBindings = Bindings<"span">;

export type SpanContext = SpanProps & {
  bindings: SpanBindings;
  el: HTMLSpanElement | null;
};

export type SpanSlots = {
  default(props: { ctx: SpanContext }): VNode[];
};
