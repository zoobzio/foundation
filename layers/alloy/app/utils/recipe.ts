import type { Recipe, HtmlAttrs, EmitHandlers, DomHandlers } from "../types/recipe";

export const recipe = <Props, Emits = {}>(
  props: Props & HtmlAttrs,
  handlers: EmitHandlers<Emits> & DomHandlers = {},
): Recipe<Props, Emits> => ({ props, handlers });
