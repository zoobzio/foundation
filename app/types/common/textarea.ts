import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";

export type TextareaProps = {
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  rows?: number;
  modifiers?: ModifierProps<"textarea">;
  tokens?: TokenProps<"textarea">;
  aria?: AriaProps<"textarea">;
};

export type TextareaEmits = ComponentEvents["textarea"];

export type TextareaBindings = Bindings<"textarea">;

export type TextareaContext = TextareaProps & {
  bindings: TextareaBindings;
  el: HTMLTextAreaElement | null;
};
