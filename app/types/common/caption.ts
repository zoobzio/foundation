import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type CaptionProps = {
  label?: string;
  modifiers?: ModifierProps<"caption">;
  tokens?: TokenProps<"caption">;
  aria?: AriaProps<"caption">;
};

export type CaptionEmits = ComponentEvents["caption"];

export type CaptionBindings = Bindings<"caption">;

export type CaptionContext = CaptionProps & {
  bindings: CaptionBindings;
  el: HTMLDivElement | null;
};

export type CaptionSlots = {
  default(props: CaptionContext): VNode[];
};
