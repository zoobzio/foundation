import type { IconAlias } from "#foundation/types/common/iconic";
import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type CaptionProps = {
  label?: string;
  icon?: IconAlias;
  variant?: OreVariants["caption"];
  size?: OreSizes["caption"];
  color?: OreColors["caption"];
  radius?: OreRadius["caption"];
  density?: OreDensity["caption"];
  elevation?: OreElevation["caption"];
};
