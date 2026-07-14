import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type OlProps = {
  variant?: OreVariants["ol"];
  size?: OreSizes["ol"];
  color?: OreColors["ol"];
  radius?: OreRadius["ol"];
  density?: OreDensity["ol"];
  elevation?: OreElevation["ol"];
};
