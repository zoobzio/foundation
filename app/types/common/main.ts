import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type MainProps = {
  label?: string;
  variant?: OreVariants["main"];
  size?: OreSizes["main"];
  color?: OreColors["main"];
  radius?: OreRadius["main"];
  density?: OreDensity["main"];
  elevation?: OreElevation["main"];
};
