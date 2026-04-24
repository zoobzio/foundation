import type { TabsRootProps, TabsRootEmits, TabsListProps, TabsTriggerProps, TabsContentProps } from "reka-ui";

export type TabsPassthrough = {
  root?: Passthrough<TabsRootProps, TabsRootEmits>;
  list?: Passthrough<TabsListProps>;
  trigger?: Passthrough<TabsTriggerProps>;
  content?: Passthrough<TabsContentProps>;
};

export type TabsProps = {
  tabs: Option[];
  pt?: TabsPassthrough;
};

export type TabsEmits = {};

export const defineTabs = defineComponentRecipe<TabsProps, TabsEmits>();

export type TabsRecipe = Recipe<TabsProps, TabsEmits>;
