import type { AriaProps } from "#foundation/types/aria";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";

export type ButtonProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  modifiers?: ModifierProps<"button">;
  tokens?: TokenProps<"button">;
  aria?: AriaProps<"button">;
};
