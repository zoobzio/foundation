import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type SectionProps = {
  label?: string;
  variant?: OreVariants["section"];
  size?: OreSizes["section"];
  color?: OreColors["section"];
  radius?: OreRadius["section"];
  density?: OreDensity["section"];
  elevation?: OreElevation["section"];
};
