import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type ImgProps = {
  src: string;
  alt?: string;
  variant?: OreVariants["img"];
  size?: OreSizes["img"];
  color?: OreColors["img"];
  radius?: OreRadius["img"];
  density?: OreDensity["img"];
  elevation?: OreElevation["img"];
};
