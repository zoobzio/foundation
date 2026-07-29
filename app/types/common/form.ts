import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type FormProps = {
  modifiers?: ModifierProps<"form">;
  tokens?: TokenProps<"form">;
  aria?: AriaProps<"form">;
};

export type FormEmits = ComponentEvents["form"];

export type FormBindings = Bindings<"form">;

export type FormContext = FormProps & {
  bindings: FormBindings;
  el: HTMLFormElement | null;
};

export type FormSlots = {
  default(props: FormContext): VNode[];
};
