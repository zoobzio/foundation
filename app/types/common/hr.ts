import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";

export type HrProps = {
  modifiers?: ModifierProps<"hr">;
  tokens?: TokenProps<"hr">;
  aria?: AriaProps<"hr">;
};

export type HrBindings = Bindings<"hr">;

export type HrContext = HrProps & {
  bindings: HrBindings;
  el: HTMLHRElement | null;
};
