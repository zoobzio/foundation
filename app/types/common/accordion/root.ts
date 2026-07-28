import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  AccordionRootEmits as RekaAccordionRootEmits,
  AccordionRootProps as RekaAccordionRootProps,
} from "reka-ui";

export type AccordionRootForward = Reshape<RekaAccordionRootProps, "modelValue">;

export type AccordionRootProps = RekaAccordionRootProps & {
  modifiers?: ModifierProps<"accordion-root">;
  tokens?: TokenProps<"accordion-root">;
  aria?: AriaProps<"accordion-root">;
};

export type AccordionRootEmits = RekaAccordionRootEmits & ComponentEvents["accordion-root"];

export type AccordionRootBindings = Bindings<
  "accordion-root",
  AccordionRootForward
>;

export type AccordionRootContext = Reshape<AccordionRootProps, "modelValue"> & {
  modelValue: Ref<string | string[] | undefined>;
  bindings: AccordionRootBindings;
  el: ComponentPublicInstance | null;
};

export type AccordionRootSlots = {
  default(props: AccordionRootContext): VNode[];
};
