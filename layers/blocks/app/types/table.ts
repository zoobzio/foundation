import type { table } from "../../elements.config";

export type TableProps = {
  tokens?: Tokens<typeof table.key>;
};

export type TableEmits = {};

export const defineTable = useComponentRecipe<TableProps, TableEmits>();
