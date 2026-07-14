import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type TdProps = {
  variant?: OreVariants["td"];
  size?: OreSizes["td"];
  color?: OreColors["td"];
  radius?: OreRadius["td"];
  density?: OreDensity["td"];
  elevation?: OreElevation["td"];
};
