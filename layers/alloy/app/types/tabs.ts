import type { TabsRootProps, TabsListProps, TabsTriggerProps, TabsContentProps } from "reka-ui";

export type TabsPassthrough = {
  root?: Passthrough<TabsRootProps>;
  list?: Passthrough<TabsListProps>;
  trigger?: Passthrough<TabsTriggerProps>;
  content?: Passthrough<TabsContentProps>;
};

export type TabsProps = {
  tabs: Option[];
  pt?: TabsPassthrough;
};

export type TabsEmits = {};

export const defineTabs = useComponentRecipe<TabsProps, TabsEmits>();

export type TabsRecipe = ComponentRecipe<TabsProps, TabsEmits>;
