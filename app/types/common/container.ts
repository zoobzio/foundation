import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type ContainerProps = {
  label?: string;
  modifiers?: ModifierProps<"container">;
  tokens?: TokenProps<"container">;
  aria?: AriaProps<"container">;
};

export type ContainerBindings = Bindings<"container">;

export type ContainerContext = ContainerProps & {
  bindings: ContainerBindings;
  el: HTMLDivElement | null;
};

export type ContainerSlots = {
  default(props: { ctx: ContainerContext }): VNode[];
};
