import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";

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

export type InputBindings = Bindings<"input">;

export type InputContext = InputProps & {
  bindings: InputBindings;
  el: HTMLInputElement | null;
};
