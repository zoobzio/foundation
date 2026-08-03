import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  TabsRootEmits as RekaTabsRootEmits,
  TabsRootProps as RekaTabsRootProps,
} from "reka-ui";

export type TabsRootForward = Reshape<RekaTabsRootProps, "modelValue">;

export type TabsRootProps = RekaTabsRootProps & {
  modifiers?: ModifierProps<"tabs-root">;
  tokens?: TokenProps<"tabs-root">;
  aria?: AriaProps<"tabs-root">;
};

export type TabsRootEmits = RekaTabsRootEmits & ComponentEvents["tabs-root"];

export type TabsRootBindings = Bindings<"tabs-root", TabsRootForward>;

export type TabsRootContext = Reshape<TabsRootProps, "modelValue"> & {
  modelValue: Ref<string | number | undefined>;
  bindings: TabsRootBindings;
  el: ComponentPublicInstance | null;
};

export type TabsRootSlots = {
  default(props: TabsRootContext): VNode[];
};
