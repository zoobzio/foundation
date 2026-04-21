export type ChipPassthrough = {
  root?: Passthrough<ButtonProps>;
};

export type ChipProps = {
  label?: string;
  closable?: boolean;
  pt?: ChipPassthrough;
};

export type ChipEmits = {
  close: [];
};

export const defineChip = useComponentRecipe<ChipProps, ChipEmits>();

export type ChipRecipe = ComponentRecipe<ChipProps, ChipEmits>;
