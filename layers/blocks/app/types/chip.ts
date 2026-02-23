export type ChipProps = {
  label?: string;
  closable?: boolean;
};

export type ChipEmits = {
  close: [];
};

export const defineChip = useComponentRecipe<ChipProps, ChipEmits>();
