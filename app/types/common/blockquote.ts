import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type BlockquoteProps = {
  variant?: OreVariants["blockquote"];
  size?: OreSizes["blockquote"];
  color?: OreColors["blockquote"];
  radius?: OreRadius["blockquote"];
  density?: OreDensity["blockquote"];
  elevation?: OreElevation["blockquote"];
};
