import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
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

export type AnchorBindings = Bindings<"anchor">;

export type AnchorContext = AnchorProps & {
  bindings: AnchorBindings;
  el: ComponentPublicInstance | null;
};

export type AnchorSlots = {
  default(props: { ctx: AnchorContext }): VNode[];
};
