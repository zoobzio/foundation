import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";

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

export type TextareaBindings = Bindings<"textarea">;

export type TextareaContext = TextareaProps & {
  bindings: TextareaBindings;
  el: HTMLTextAreaElement | null;
};
