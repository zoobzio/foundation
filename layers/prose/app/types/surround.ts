import type { PageCollections } from "@nuxt/content";
import type { SurroundOrder } from "../composables/surround";

export type SurroundPassthrough = {};

export type SurroundProps<T extends keyof PageCollections> = {
  collection: T;
  path?: string;
  prevLabel?: string;
  nextLabel?: string;
  order?: SurroundOrder<T>;
  pt?: SurroundPassthrough;
};

export type SurroundEmits = {};

export const defineSurround = useComponentRecipe<SurroundProps<keyof PageCollections>, SurroundEmits>();

export type SurroundRecipe = ComponentRecipe<SurroundProps<keyof PageCollections>, SurroundEmits>;
