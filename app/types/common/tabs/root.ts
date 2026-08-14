import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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

export type TabsRootEmits = RekaTabsRootEmits & {};

export type TabsRootBindings = Bindings<"tabs-root", TabsRootForward>;

export type TabsRootContext = Reshape<TabsRootProps, "modelValue"> & {
  modelValue: Ref<string | number | undefined>;
  bindings: TabsRootBindings;
  el: ComponentPublicInstance | null;
};

export type TabsRootSlots = {
  default(props: TabsRootContext): VNode[];
};
