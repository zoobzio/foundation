import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type NavProps = {
  label?: string;
  variant?: OreVariants["nav"];
  size?: OreSizes["nav"];
  color?: OreColors["nav"];
  radius?: OreRadius["nav"];
  density?: OreDensity["nav"];
  elevation?: OreElevation["nav"];
};
