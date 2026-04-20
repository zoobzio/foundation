export type AsciiLogoPassthrough = {
  link?: Passthrough<AnchorProps>;
  pre?: Passthrough<PreProps>;
};

export type AsciiLogoProps = {
  text: string;
  font?: string;
  link?: boolean;
  pt?: AsciiLogoPassthrough;
};

export type AsciiLogoEmits = {};

export const defineAsciiLogo = useComponentRecipe<AsciiLogoProps, AsciiLogoEmits>();

export type AsciiLogoRecipe = ComponentRecipe<AsciiLogoProps, AsciiLogoEmits>;
