import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
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
