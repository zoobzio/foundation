import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TabsContentProps as RekaTabsContentProps } from "reka-ui";

export type TabsContentForward = Reshape<RekaTabsContentProps>;

export type TabsContentProps = RekaTabsContentProps & {
  modifiers?: ModifierProps<"tabs-content">;
  tokens?: TokenProps<"tabs-content">;
  aria?: AriaProps<"tabs-content">;
};

export type TabsContentEmits = {};

export type TabsContentBindings = Bindings<"tabs-content", TabsContentForward>;

export type TabsContentContext = Reshape<TabsContentProps> & {
  bindings: TabsContentBindings;
  el: ComponentPublicInstance | null;
};

export type TabsContentSlots = {
  default(props: TabsContentContext): VNode[];
};
