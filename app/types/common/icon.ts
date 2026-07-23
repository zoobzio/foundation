import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { IconAlias } from "#foundation/types/common/iconic";

export type IconProps = {
  alias: IconAlias;
  label?: string;
  modifiers?: ModifierProps<"icon">;
  tokens?: TokenProps<"icon">;
  aria?: AriaProps<"icon">;
};

export type IconBindings = Bindings<"icon">;

export type IconContext = IconProps & {
  bindings: IconBindings;
  el: SVGSVGElement | null;
};
