import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type FieldsetProps = {
  legend?: string;
  disabled?: boolean;
  modifiers?: ModifierProps<"fieldset">;
  tokens?: TokenProps<"fieldset">;
  aria?: AriaProps<"fieldset">;
};

export type FieldsetEmits = ComponentEvents["fieldset"];

export type FieldsetBindings = Bindings<"fieldset">;

export type FieldsetContext = FieldsetProps & {
  bindings: FieldsetBindings;
  el: HTMLFieldSetElement | null;
};

export type FieldsetSlots = {
  default(props: FieldsetContext): VNode[];
};
