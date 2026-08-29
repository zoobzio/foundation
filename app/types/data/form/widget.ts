import type {
  ScrollerEmits,
  ScrollerProps,
} from "../../core/scroller";
import type { Passthrough, PT } from "../../passthrough";
import type { Service, Events } from "../form";
import type {
  FormFieldPassthrough,
  FormFieldSlots,
} from "./field";
import type { VNode } from "vue";

export type FormWidgetPassthrough = {
  scroller: Passthrough<ScrollerProps, ScrollerEmits>;
};

export type FormWidgetProps<T> = {
  service: Service<T>;
  pt?: PT<FormWidgetPassthrough> & {
    fields?: Partial<Record<keyof T, PT<FormFieldPassthrough>>>;
  };
};

export type FormWidgetEmits<T> = {
  initialized: Parameters<Events<T>["form:initialized"]>;
  submitted: Parameters<Events<T>["form:submitted"]>;
  rejected: Parameters<Events<T>["form:rejected"]>;
  restored: Parameters<Events<T>["form:restored"]>;
  reset: Parameters<Events<T>["form:reset"]>;
};

export type FormWidgetContext<T> = {
  form: Service<T>;
  el: HTMLDivElement | null;
  settings: FormWidgetPassthrough;
};

export type FormWidgetSlots<T> = FormFieldSlots<T> & {
  toolbar?: (props: FormWidgetContext<T>) => VNode[];
  footer?: (props: FormWidgetContext<T>) => VNode[];
};
