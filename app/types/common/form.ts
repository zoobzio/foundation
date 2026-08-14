import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { EventEmits } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type FormProps = {
  modifiers?: ModifierProps<"form">;
  tokens?: TokenProps<"form">;
  aria?: AriaProps<"form">;
};

export type FormEmits = EventEmits<"submit" | "reset">;

export type FormBindings = Bindings<"form">;

export type FormContext = FormProps & {
  bindings: FormBindings;
  el: HTMLFormElement | null;
};

export type FormSlots = {
  default(props: FormContext): VNode[];
};
