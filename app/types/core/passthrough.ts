import type { HtmlAttrs, EmitHandlers, DomHandlers } from "#foundation/types/core/recipe";

export type Passthrough<Props, Emits = {}> = {
  props?: Partial<Props & HtmlAttrs>;
  handlers?: Partial<EmitHandlers<Emits> & DomHandlers>;
};
