export type NavigatorProps = {
  items: NavigatorItem[];
  orientation?: "horizontal" | "vertical";
  indicator?: boolean;
  delayDuration?: number;
  skipDelayDuration?: number;
  featured?: Link;
  tokens?: Tokens<
    | "navigator-root"
    | "navigator-list"
    | "navigator-item"
    | "navigator-trigger"
    | "navigator-link"
    | "navigator-content"
    | "navigator-viewport"
    | "navigator-viewport-wrapper"
    | "navigator-indicator"
    | "navigator-grid"
    | "navigator-card"
    | "navigator-card-title"
    | "navigator-card-description"
    | "navigator-featured"
    | "navigator-featured-title"
    | "navigator-featured-description"
  >;
};

export type NavigatorEmits = {};

export const defineNavigator = useComponentRecipe<NavigatorProps, NavigatorEmits>();
