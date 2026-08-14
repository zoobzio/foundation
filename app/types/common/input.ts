import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { EventEmits } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";

export type InputProps = {
  type?: "text" | "email" | "password" | "search" | "url" | "tel" | "number";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  modifiers?: ModifierProps<"input">;
  tokens?: TokenProps<"input">;
  aria?: AriaProps<"input">;
};

export type InputEmits = EventEmits<"input" | "change" | "focus" | "blur">;

export type InputBindings = Bindings<"input">;

export type InputContext = InputProps & {
  bindings: InputBindings;
  el: HTMLInputElement | null;
};
