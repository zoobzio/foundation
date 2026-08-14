import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TabsListProps as RekaTabsListProps } from "reka-ui";

export type TabsListForward = Reshape<RekaTabsListProps>;

export type TabsListProps = RekaTabsListProps & {
  modifiers?: ModifierProps<"tabs-list">;
  tokens?: TokenProps<"tabs-list">;
  aria?: AriaProps<"tabs-list">;
};

export type TabsListEmits = ComponentEvents["tabs-list"];

export type TabsListBindings = Bindings<"tabs-list", TabsListForward>;

export type TabsListContext = Reshape<TabsListProps> & {
  bindings: TabsListBindings;
  el: ComponentPublicInstance | null;
};

export type TabsListSlots = {
  default(props: TabsListContext): VNode[];
};
