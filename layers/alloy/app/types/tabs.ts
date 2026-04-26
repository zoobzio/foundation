import type { TabsRootProps, TabsRootEmits, TabsListProps, TabsTriggerProps, TabsContentProps } from "reka-ui";

export type TabsPassthrough = {
  root?: Passthrough<TabsRootProps, TabsRootEmits>;
  list?: Passthrough<TabsListProps>;
  trigger?: Passthrough<TabsTriggerProps>;
  triggerIcon?: Passthrough<IconProps>;
  content?: Passthrough<TabsContentProps>;
};

export type TabsProps = {
  modelValue?: string;
  tabs: Option[];
  pt?: TabsPassthrough;
};

export type TabsEmits = {
  "update:modelValue": [value: string];
};

export type TabsRecipe = Recipe<TabsProps, TabsEmits>;
