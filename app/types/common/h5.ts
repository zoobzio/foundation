import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type H5Props = {
  label?: string;
  modifiers?: ModifierProps<"h5">;
  tokens?: TokenProps<"h5">;
  aria?: AriaProps<"h5">;
};

export type H5Emits = ComponentEvents["h5"];

export type H5Bindings = Bindings<"h5">;

export type H5Context = H5Props & {
  bindings: H5Bindings;
  el: HTMLHeadingElement | null;
};

export type H5Slots = {
  default(props: H5Context): VNode[];
};
