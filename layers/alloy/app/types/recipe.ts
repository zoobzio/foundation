import type { StyleValue, HTMLAttributes } from "vue";

export type HtmlAttrs = {
  class?: HTMLAttributes["class"];
  id?: string;
  style?: StyleValue;
  title?: string;
  alt?: string;
  src?: string;
  href?: string;
  placeholder?: string;
  tabindex?: number | string;
  [key: `aria-${string}`]: string | boolean | undefined;
  [key: `data-${string}`]: string | boolean | number | undefined;
};

export type DomHandlers = {
  click?: (event: MouseEvent) => void;
  dblclick?: (event: MouseEvent) => void;
  mousedown?: (event: MouseEvent) => void;
  mouseup?: (event: MouseEvent) => void;
  mousemove?: (event: MouseEvent) => void;
  mouseenter?: (event: MouseEvent) => void;
  mouseleave?: (event: MouseEvent) => void;
  mouseover?: (event: MouseEvent) => void;
  mouseout?: (event: MouseEvent) => void;
  contextmenu?: (event: MouseEvent) => void;
  pointerdown?: (event: PointerEvent) => void;
  pointerup?: (event: PointerEvent) => void;
  pointermove?: (event: PointerEvent) => void;
  pointerenter?: (event: PointerEvent) => void;
  pointerleave?: (event: PointerEvent) => void;
  keydown?: (event: KeyboardEvent) => void;
  keyup?: (event: KeyboardEvent) => void;
  focus?: (event: FocusEvent) => void;
  blur?: (event: FocusEvent) => void;
  focusin?: (event: FocusEvent) => void;
  focusout?: (event: FocusEvent) => void;
  input?: (event: InputEvent) => void;
  change?: (event: Event) => void;
  scroll?: (event: Event) => void;
};

export type EmitHandlers<E> = {
  [K in keyof E]?: E[K] extends [infer A] ? (arg: A) => void : () => void;
};

export type Recipe<Props, Emits = {}> = {
  props: Props & HtmlAttrs;
  handlers: EmitHandlers<Emits> & DomHandlers;
};

