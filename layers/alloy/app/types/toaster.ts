import type { ToastViewportProps } from "reka-ui";

export type ToasterPassthrough = {
  viewport?: Passthrough<ToastViewportProps>;
};

export type ToasterProps = {
  pt?: ToasterPassthrough;
};

export type ToasterEmits = {};

export const defineToaster = defineComponentRecipe<ToasterProps, ToasterEmits>();

export type ToasterRecipe = Recipe<ToasterProps, ToasterEmits>;
