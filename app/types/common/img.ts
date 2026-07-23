import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";

export type ImgProps = {
  src: string;
  alt?: string;
  modifiers?: ModifierProps<"img">;
  tokens?: TokenProps<"img">;
  aria?: AriaProps<"img">;
};

export type ImgBindings = Bindings<"img">;

export type ImgContext = ImgProps & {
  bindings: ImgBindings;
  el: HTMLImageElement | null;
};
