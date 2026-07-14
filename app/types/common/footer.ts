import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type FooterProps = {
  label?: string;
  variant?: OreVariants["footer"];
  size?: OreSizes["footer"];
  color?: OreColors["footer"];
  radius?: OreRadius["footer"];
  density?: OreDensity["footer"];
  elevation?: OreElevation["footer"];
};
