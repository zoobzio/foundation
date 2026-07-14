import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type AsideProps = {
  label?: string;
  variant?: OreVariants["aside"];
  size?: OreSizes["aside"];
  color?: OreColors["aside"];
  radius?: OreRadius["aside"];
  density?: OreDensity["aside"];
  elevation?: OreElevation["aside"];
};
