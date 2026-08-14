import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type GroupProps = {
  label?: string;
  modifiers?: ModifierProps<"group">;
  tokens?: TokenProps<"group">;
  aria?: AriaProps<"group">;
};

export type GroupEmits = {};

export type GroupBindings = Bindings<"group">;

export type GroupContext = GroupProps & {
  bindings: GroupBindings;
  el: HTMLDivElement | null;
};

export type GroupSlots = {
  default(props: GroupContext): VNode[];
};
