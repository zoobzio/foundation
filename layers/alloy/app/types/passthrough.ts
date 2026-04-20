import type { StyleValue, HTMLAttributes } from "vue";

type HtmlAttrs = {
  class?: HTMLAttributes["class"];
  id?: string;
  style?: StyleValue;
} & Record<string, unknown>;

export type Passthrough<Props> = Props & HtmlAttrs;
