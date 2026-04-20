export type InputProps = {
  type?: "text" | "email" | "password" | "search" | "url" | "tel" | "number";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  variant?: OreVariants["input"];
  size?: OreSizes["input"];
  color?: OreColors["input"];
  radius?: OreRadius["input"];
  density?: OreDensity["input"];
  elevation?: OreElevation["input"];
};
