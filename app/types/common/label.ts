import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type LabelProps = {
  for?: string;
  variant?: OreVariants["label"];
  size?: OreSizes["label"];
  color?: OreColors["label"];
  radius?: OreRadius["label"];
  density?: OreDensity["label"];
  elevation?: OreElevation["label"];
};
