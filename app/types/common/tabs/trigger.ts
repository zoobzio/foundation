import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TabsTriggerProps as RekaTabsTriggerProps } from "reka-ui";

export type TabsTriggerForward = Reshape<RekaTabsTriggerProps>;

export type TabsTriggerProps = RekaTabsTriggerProps & {
  modifiers?: ModifierProps<"tabs-trigger">;
  tokens?: TokenProps<"tabs-trigger">;
  aria?: AriaProps<"tabs-trigger">;
};

export type TabsTriggerEmits = ComponentEvents["tabs-trigger"];

export type TabsTriggerBindings = Bindings<"tabs-trigger", TabsTriggerForward>;

export type TabsTriggerContext = Reshape<TabsTriggerProps> & {
  bindings: TabsTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type TabsTriggerSlots = {
  default(props: TabsTriggerContext): VNode[];
};
