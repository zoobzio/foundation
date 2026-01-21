import type { kbd } from "../../elements.config";

export type KbdProps = {
  tokens?: Tokens<typeof kbd.key>;
};

export type KbdEmits = {};

export const defineKbd = useComponentRecipe<KbdProps, KbdEmits>();
