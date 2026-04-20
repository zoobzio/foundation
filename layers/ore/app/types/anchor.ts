export type AnchorProps = {
  label?: string;
  to?: string;
  icon?: IconAlias;
  external?: boolean;
  target?: "_blank" | "_self";
  replace?: boolean;
  prefetch?: boolean;
  disabled?: boolean;
  variant?: OreVariants["anchor"];
  size?: OreSizes["anchor"];
  color?: OreColors["anchor"];
  radius?: OreRadius["anchor"];
  density?: OreDensity["anchor"];
  elevation?: OreElevation["anchor"];
};
