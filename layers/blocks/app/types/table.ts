export type TableProps = {
  tokens?: Tokens<"table">;
};

export type TableEmits = {};

export const defineTable = useComponentRecipe<TableProps, TableEmits>();
