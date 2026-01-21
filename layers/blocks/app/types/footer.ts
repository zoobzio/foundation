import type { footer } from "../../elements.config";

export type FooterProps = {
  tokens?: Tokens<typeof footer.key>;
};

export type FooterEmits = {};

export const defineFooter = useComponentRecipe<FooterProps, FooterEmits>();
