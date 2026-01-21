import type { tbody } from "../../elements.config";

export type TbodyProps = {
  tokens?: Tokens<typeof tbody.key>;
};

export type TbodyEmits = {};

export const defineTbody = useComponentRecipe<TbodyProps, TbodyEmits>();
