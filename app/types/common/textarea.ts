import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type TextareaProps = {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  rows?: number;
  ariaDescribedby?: string;
  ariaInvalid?: boolean;
  variant?: OreVariants["textarea"];
  size?: OreSizes["textarea"];
  color?: OreColors["textarea"];
  radius?: OreRadius["textarea"];
  density?: OreDensity["textarea"];
  elevation?: OreElevation["textarea"];
};
