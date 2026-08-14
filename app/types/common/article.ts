import type { AriaProps } from "../aria";
import type { Bindings } from "../bindings";
import type { ComponentEvents } from "../events";
import type { ModifierProps } from "../modifiers";
import type { TokenProps } from "../tokens";
import type { VNode } from "vue";

export type ArticleProps = {
  label?: string;
  modifiers?: ModifierProps<"article">;
  tokens?: TokenProps<"article">;
  aria?: AriaProps<"article">;
};

export type ArticleEmits = ComponentEvents["article"];

export type ArticleBindings = Bindings<"article">;

export type ArticleContext = ArticleProps & {
  bindings: ArticleBindings;
  el: HTMLElement | null;
};

export type ArticleSlots = {
  default(props: ArticleContext): VNode[];
};
