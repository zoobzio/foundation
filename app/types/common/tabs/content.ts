import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TabsContentProps as RekaTabsContentProps } from "reka-ui";

export type TabsContentForward = Reshape<RekaTabsContentProps>;

export type TabsContentProps = RekaTabsContentProps & {
  modifiers?: ModifierProps<"tabs-content">;
  tokens?: TokenProps<"tabs-content">;
  aria?: AriaProps<"tabs-content">;
};

export type TabsContentEmits = ComponentEvents["tabs-content"];

export type TabsContentBindings = Bindings<"tabs-content", TabsContentForward>;

export type TabsContentContext = Reshape<TabsContentProps> & {
  bindings: TabsContentBindings;
  el: ComponentPublicInstance | null;
};

export type TabsContentSlots = {
  default(props: TabsContentContext): VNode[];
};
