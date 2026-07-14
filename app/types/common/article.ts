import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type ArticleProps = {
  label?: string;
  variant?: OreVariants["article"];
  size?: OreSizes["article"];
  color?: OreColors["article"];
  radius?: OreRadius["article"];
  density?: OreDensity["article"];
  elevation?: OreElevation["article"];
};
