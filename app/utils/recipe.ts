import type { Recipe, HtmlAttrs, EmitHandlers, DomHandlers } from "#foundation/types/core/recipe";

export function recipe<Props, Emits = {}>(
  props: Props & HtmlAttrs,
  handlers: EmitHandlers<Emits> & DomHandlers = {},
): Recipe<Props, Emits> {
  return { props, handlers };
}
