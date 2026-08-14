import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { IconAlias } from "./iconic";

export type IconProps = {
  alias: IconAlias;
  label?: string;
  modifiers?: ModifierProps<"icon">;
  tokens?: TokenProps<"icon">;
  aria?: AriaProps<"icon">;
};

export type IconEmits = ComponentEvents["icon"];

export type IconBindings = Bindings<"icon">;

export type IconContext = IconProps & {
  bindings: IconBindings;
  el: SVGSVGElement | null;
};
