import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type SpanProps = {
  label?: string;
  modifiers?: ModifierProps<"span">;
  tokens?: TokenProps<"span">;
  aria?: AriaProps<"span">;
};

export type SpanEmits = ComponentEvents["span"];

export type SpanBindings = Bindings<"span">;

export type SpanContext = SpanProps & {
  bindings: SpanBindings;
  el: HTMLSpanElement | null;
};

export type SpanSlots = {
  default(props: SpanContext): VNode[];
};
