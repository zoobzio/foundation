import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, VNode } from "vue";
import type {
  SelectContentEmits as RekaSelectContentEmits,
  SelectContentProps as RekaSelectContentProps,
} from "reka-ui";

export type SelectContentForward = Reshape<RekaSelectContentProps>;

export type SelectContentProps = RekaSelectContentProps & {
  modifiers?: ModifierProps<"select-content">;
  tokens?: TokenProps<"select-content">;
  aria?: AriaProps<"select-content">;
};

export type SelectContentEmits = RekaSelectContentEmits & ComponentEvents["select-content"];

export type SelectContentBindings = Bindings<"select-content", SelectContentForward>;

export type SelectContentContext = Reshape<SelectContentProps> & {
  bindings: SelectContentBindings;
  el: ComponentPublicInstance | null;
};

export type SelectContentSlots = {
  default(props: SelectContentContext): VNode[];
};
