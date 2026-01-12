export type KbdProps = {
  tokens?: Tokens<"kbd">;
};

export type KbdEmits = {};

export const defineKbd = useComponentRecipe<KbdProps, KbdEmits>();
