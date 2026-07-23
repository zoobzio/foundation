import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type FieldsetProps = {
  legend?: string;
  disabled?: boolean;
  modifiers?: ModifierProps<"fieldset">;
  tokens?: TokenProps<"fieldset">;
  aria?: AriaProps<"fieldset">;
};

export type FieldsetBindings = Bindings<"fieldset">;

export type FieldsetContext = FieldsetProps & {
  bindings: FieldsetBindings;
  el: HTMLFieldSetElement | null;
};

export type FieldsetSlots = {
  default(props: { ctx: FieldsetContext }): VNode[];
};
