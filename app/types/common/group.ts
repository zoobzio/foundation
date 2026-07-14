import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type GroupProps = {
  label?: string;
  variant?: OreVariants["group"];
  size?: OreSizes["group"];
  color?: OreColors["group"];
  radius?: OreRadius["group"];
  density?: OreDensity["group"];
  elevation?: OreElevation["group"];
};
