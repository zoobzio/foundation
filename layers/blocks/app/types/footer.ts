export type FooterProps = {
  tokens?: Tokens<"footer">;
};

export type FooterEmits = {};

export const defineFooter = useComponentRecipe<FooterProps, FooterEmits>();
