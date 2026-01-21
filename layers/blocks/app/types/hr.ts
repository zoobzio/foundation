import type { hr } from "../../elements.config";

export type HrProps = {
  tokens?: Tokens<typeof hr.key>;
};

export type HrEmits = {};

export const defineHr = useComponentRecipe<HrProps, HrEmits>();
