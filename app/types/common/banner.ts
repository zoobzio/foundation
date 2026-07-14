import type { IconAlias } from "#foundation/types/common/iconic";
import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type BannerProps = {
  label?: string;
  role?: "banner" | "status" | "alert";
  icon?: IconAlias;
  variant?: OreVariants["banner"];
  size?: OreSizes["banner"];
  color?: OreColors["banner"];
  radius?: OreRadius["banner"];
  density?: OreDensity["banner"];
  elevation?: OreElevation["banner"];
};
