import type { code } from "../../elements.config";

export type CodeProps = {
  tokens?: Tokens<typeof code.key>;
};

export type CodeEmits = {};

export const defineCode = useComponentRecipe<CodeProps, CodeEmits>();
