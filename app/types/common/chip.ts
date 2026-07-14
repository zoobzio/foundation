import type { OreColors, OreDensity, OreElevation, OreRadius, OreSizes, OreVariants } from "#foundation/types/common/modifiers";
export type ChipProps = {
  label?: string;
  closable?: boolean;
  disabled?: boolean;
  ariaPressed?: boolean;
  ariaSelected?: boolean;
  variant?: OreVariants["chip"];
  size?: OreSizes["chip"];
  color?: OreColors["chip"];
  radius?: OreRadius["chip"];
  density?: OreDensity["chip"];
  elevation?: OreElevation["chip"];
};
