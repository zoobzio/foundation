import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type InputProps = {
  type?: "text" | "email" | "password" | "search" | "url" | "tel" | "number";
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  ariaDescribedby?: string;
  ariaInvalid?: boolean;
  variant?: OreVariants["input"];
  size?: OreSizes["input"];
  color?: OreColors["input"];
  radius?: OreRadius["input"];
  density?: OreDensity["input"];
  elevation?: OreElevation["input"];
};
