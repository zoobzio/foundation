export type TbodyProps = {
  tokens?: Tokens<"tbody">;
};

export type TbodyEmits = {};

export const defineTbody = useComponentRecipe<TbodyProps, TbodyEmits>();
