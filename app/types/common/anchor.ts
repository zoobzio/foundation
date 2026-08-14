import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { EventEmits } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { ComponentPublicInstance, VNode } from "vue";

export type AnchorProps = {
  label?: string;
  to?: string;
  external?: boolean;
  target?: "_blank" | "_self";
  replace?: boolean;
  prefetch?: boolean;
  disabled?: boolean;
  modifiers?: ModifierProps<"anchor">;
  tokens?: TokenProps<"anchor">;
  aria?: AriaProps<"anchor">;
};

export type AnchorEmits = EventEmits<"click">;

export type AnchorBindings = Bindings<"anchor">;

export type AnchorContext = AnchorProps & {
  bindings: AnchorBindings;
  el: ComponentPublicInstance | null;
};

export type AnchorSlots = {
  default(props: AnchorContext): VNode[];
};
