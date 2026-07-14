import type { IconAlias } from "#foundation/types/common/iconic";
import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type IconProps = {
  alias: IconAlias;
  label?: string;
  variant?: OreVariants["icon"];
  size?: OreSizes["icon"];
  color?: OreColors["icon"];
  radius?: OreRadius["icon"];
  density?: OreDensity["icon"];
  elevation?: OreElevation["icon"];
};
