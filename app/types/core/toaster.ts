import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { ToastProviderProps, ToastViewportProps } from "reka-ui";

export type ToasterPassthrough = {
  provider?: Passthrough<ToastProviderProps>;
  viewport?: Passthrough<ToastViewportProps>;
};

export type ToasterProps = {
  pt?: ToasterPassthrough;
};

export type ToasterEmits = {};

export type ToasterRecipe = Recipe<ToasterProps, ToasterEmits>;
