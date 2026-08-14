import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";

export type HrProps = {
  modifiers?: ModifierProps<"hr">;
  tokens?: TokenProps<"hr">;
  aria?: AriaProps<"hr">;
};

export type HrEmits = ComponentEvents["hr"];

export type HrBindings = Bindings<"hr">;

export type HrContext = HrProps & {
  bindings: HrBindings;
  el: HTMLHRElement | null;
};
