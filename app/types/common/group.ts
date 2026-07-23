import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type GroupProps = {
  label?: string;
  modifiers?: ModifierProps<"group">;
  tokens?: TokenProps<"group">;
  aria?: AriaProps<"group">;
};

export type GroupBindings = Bindings<"group">;

export type GroupContext = GroupProps & {
  bindings: GroupBindings;
  el: HTMLDivElement | null;
};

export type GroupSlots = {
  default(props: { ctx: GroupContext }): VNode[];
};
