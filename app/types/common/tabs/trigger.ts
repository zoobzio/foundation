import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { EventEmits } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type { TabsTriggerProps as RekaTabsTriggerProps } from "reka-ui";

export type TabsTriggerForward = Reshape<RekaTabsTriggerProps>;

export type TabsTriggerProps = RekaTabsTriggerProps & {
  modifiers?: ModifierProps<"tabs-trigger">;
  tokens?: TokenProps<"tabs-trigger">;
  aria?: AriaProps<"tabs-trigger">;
};

export type TabsTriggerEmits = EventEmits<"click">;

export type TabsTriggerBindings = Bindings<"tabs-trigger", TabsTriggerForward>;

export type TabsTriggerContext = Reshape<TabsTriggerProps> & {
  bindings: TabsTriggerBindings;
  el: ComponentPublicInstance | null;
};

export type TabsTriggerSlots = {
  default(props: TabsTriggerContext): VNode[];
};
