import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type BannerProps = {
  label?: string;
  modifiers?: ModifierProps<"banner">;
  tokens?: TokenProps<"banner">;
  aria?: AriaProps<"banner">;
};

export type BannerEmits = ComponentEvents["banner"];

export type BannerBindings = Bindings<"banner">;

export type BannerContext = BannerProps & {
  bindings: BannerBindings;
  el: HTMLDivElement | null;
};

export type BannerSlots = {
  default(props: BannerContext): VNode[];
};
