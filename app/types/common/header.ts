import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type HeaderProps = {
  label?: string;
  variant?: OreVariants["header"];
  size?: OreSizes["header"];
  color?: OreColors["header"];
  radius?: OreRadius["header"];
  density?: OreDensity["header"];
  elevation?: OreElevation["header"];
};
