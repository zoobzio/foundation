export type ChipProps = {
  label?: string;
  tokens?: Tokens<"chip">;
};

export type ChipEmits = {};

export const defineChip = useComponentRecipe<ChipProps, ChipEmits>();
