import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type ContainerProps = {
  label?: string;
  modifiers?: ModifierProps<"container">;
  tokens?: TokenProps<"container">;
  aria?: AriaProps<"container">;
};

export type ContainerEmits = ComponentEvents["container"];

export type ContainerBindings = Bindings<"container">;

export type ContainerContext = ContainerProps & {
  bindings: ContainerBindings;
  el: HTMLDivElement | null;
};

export type ContainerSlots = {
  default(props: ContainerContext): VNode[];
};
