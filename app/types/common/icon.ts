import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
// The union of aliases registered in `config/icon-sheets.ts` — derived at
// build time by @icon-sheets/nuxt, so an unregistered alias fails to compile.
import type { Alias as IconAlias } from "#build/types/icon-sheets";

export type { IconAlias };

export type IconProps = {
  alias: IconAlias;
  label?: string;
  modifiers?: ModifierProps<"icon">;
  tokens?: TokenProps<"icon">;
  aria?: AriaProps<"icon">;
};

export type IconEmits = {};

export type IconBindings = Bindings<"icon">;

export type IconContext = IconProps & {
  bindings: IconBindings;
  el: SVGSVGElement | null;
};
