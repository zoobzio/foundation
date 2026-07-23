import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { VNode } from "vue";

export type ArticleProps = {
  label?: string;
  modifiers?: ModifierProps<"article">;
  tokens?: TokenProps<"article">;
  aria?: AriaProps<"article">;
};

export type ArticleBindings = Bindings<"article">;

export type ArticleContext = ArticleProps & {
  bindings: ArticleBindings;
  el: HTMLElement | null;
};

export type ArticleSlots = {
  default(props: { ctx: ArticleContext }): VNode[];
};
