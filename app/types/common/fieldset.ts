import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type FieldsetProps = {
  legend?: string;
  disabled?: boolean;
  variant?: OreVariants["fieldset"];
  size?: OreSizes["fieldset"];
  color?: OreColors["fieldset"];
  radius?: OreRadius["fieldset"];
  density?: OreDensity["fieldset"];
  elevation?: OreElevation["fieldset"];
};
