import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type CodeProps = {
  label?: string;
  modifiers?: ModifierProps<"code">;
  tokens?: TokenProps<"code">;
  aria?: AriaProps<"code">;
};

export type CodeBindings = Bindings<"code">;

export type CodeContext = CodeProps & {
  bindings: CodeBindings;
  el: HTMLElement | null;
};

export type CodeSlots = {
  default(props: { ctx: CodeContext }): VNode[];
};
