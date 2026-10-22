import type { ScrollerEmits, ScrollerProps } from "./scroller";
import type { FormFieldPassthrough, FormFieldSlots } from "./form-field";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { Events, Service } from "@zoobzio/form";
import type { ButtonHTMLAttributes, FormHTMLAttributes, VNode } from "vue";

/**
 * The parts of the form that accept passthrough. `form` is the root
 * `<form>` element; it and the `reset` and `submit` buttons type against
 * native HTML attributes and bind directly to their tags.
 */
export type FormPassthrough = {
  scroller: Passthrough<ScrollerProps, ScrollerEmits>;
  form: Passthrough<FormHTMLAttributes>;
  reset: Passthrough<ButtonHTMLAttributes>;
  submit: Passthrough<ButtonHTMLAttributes>;
};

/**
 * Props of the form: the headless service plus passthrough. `fields` keys
 * a field's passthrough by its payload key. The form owns no feature
 * state. The service's state container must be reactive for the form to
 * update.
 */
export type FormProps<T> = {
  service: Service<T>;
  pt?: PT<FormPassthrough> & {
    fields?: Partial<Record<keyof T, PT<FormFieldPassthrough>>>;
  };
};

/**
 * Emits of the form: the service's domain events, relayed with the
 * service's payloads. Literal keys, not a `Pick`: `@vue/compiler-sfc` must
 * fold the emit keys statically for `defineEmits`. `FORM_EVENTS` names the
 * relayed subset and is checked against these keys.
 */
export type FormEmits<T> = {
  initialized: Events<T>["initialized"];
  submitted: Events<T>["submitted"];
  rejected: Events<T>["rejected"];
  restored: Events<T>["restored"];
  reset: Events<T>["reset"];
  failed: Events<T>["failed"];
};

/**
 * The form view model, served to `defineExpose` and the slots.
 */
export type FormContext<T> = {
  form: Service<T>;
  el: HTMLFormElement | null;
  settings: FormPassthrough;
};

/**
 * Slots of the form: its own regions plus every field slot, relayed to
 * each field.
 */
export type FormSlots<T> = FormFieldSlots<T> & {
  toolbar?: (props: FormContext<T>) => VNode[];
  footer?: (props: FormContext<T>) => VNode[];
};

/**
 * A form instance as data: props plus emit listeners.
 */
export type FormDefinition<T> = Definition<FormProps<T>, FormEmits<T>>;
