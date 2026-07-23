import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type BannerProps = {
  label?: string;
  modifiers?: ModifierProps<"banner">;
  tokens?: TokenProps<"banner">;
  aria?: AriaProps<"banner">;
};

export type BannerBindings = Bindings<"banner">;

export type BannerContext = BannerProps & {
  bindings: BannerBindings;
  el: HTMLDivElement | null;
};

export type BannerSlots = {
  default(props: { ctx: BannerContext }): VNode[];
};
