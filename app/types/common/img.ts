import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";

export type ImgProps = {
  src: string;
  alt?: string;
  modifiers?: ModifierProps<"img">;
  tokens?: TokenProps<"img">;
  aria?: AriaProps<"img">;
};

export type ImgEmits = {};

export type ImgBindings = Bindings<"img">;

export type ImgContext = ImgProps & {
  bindings: ImgBindings;
  el: HTMLImageElement | null;
};
