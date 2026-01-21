import type { navigator } from "../../elements.config";

export type NavigatorProps = {
  items: NavigatorItem[];
  orientation?: "horizontal" | "vertical";
  indicator?: boolean;
  delayDuration?: number;
  skipDelayDuration?: number;
  featured?: Link;
  tokens?: Tokens<
    | typeof navigator.root
    | typeof navigator.list
    | typeof navigator.item
    | typeof navigator.trigger
    | typeof navigator.link
    | typeof navigator.content
    | typeof navigator.viewport
    | typeof navigator.viewportWrapper
    | typeof navigator.indicator
    | typeof navigator.grid
    | typeof navigator.card
    | typeof navigator.cardTitle
    | typeof navigator.cardDescription
    | typeof navigator.featured
    | typeof navigator.featuredTitle
    | typeof navigator.featuredDescription
  >;
};

export type NavigatorEmits = {};

export const defineNavigator = useComponentRecipe<NavigatorProps, NavigatorEmits>();
