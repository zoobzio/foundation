import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
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
