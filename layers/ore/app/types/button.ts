export type ButtonProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: OreVariants["button"];
  size?: OreSizes["button"];
  color?: OreColors["button"];
  radius?: OreRadius["button"];
  density?: OreDensity["button"];
  elevation?: OreElevation["button"];
};
