import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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

export type SelectContentEmits = RekaSelectContentEmits & {};

export type SelectContentBindings = Bindings<"select-content", SelectContentForward>;

export type SelectContentContext = Reshape<SelectContentProps> & {
  bindings: SelectContentBindings;
  el: ComponentPublicInstance | null;
};

export type SelectContentSlots = {
  default(props: SelectContentContext): VNode[];
};
