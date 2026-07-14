import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type CardProps = {
  label?: string;
  variant?: OreVariants["card"];
  size?: OreSizes["card"];
  color?: OreColors["card"];
  radius?: OreRadius["card"];
  density?: OreDensity["card"];
  elevation?: OreElevation["card"];
};
