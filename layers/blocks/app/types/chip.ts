import type { chip } from "../../elements.config";

export type ChipProps = {
  label?: string;
  tokens?: Tokens<typeof chip.key>;
};

export type ChipEmits = {};

export const defineChip = useComponentRecipe<ChipProps, ChipEmits>();
