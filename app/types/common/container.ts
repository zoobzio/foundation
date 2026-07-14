import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type ContainerProps = {
  label?: string;
  variant?: OreVariants["container"];
  size?: OreSizes["container"];
  color?: OreColors["container"];
  radius?: OreRadius["container"];
  density?: OreDensity["container"];
  elevation?: OreElevation["container"];
};
