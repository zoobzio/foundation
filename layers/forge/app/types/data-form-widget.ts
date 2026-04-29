import type { Form } from "./data-form";
import type { DataFormFieldPassthrough } from "./data-form-field";

export type DataFormPassthrough<T> = {
  root?: Passthrough<GroupProps>;
  toolbar?: Passthrough<GroupProps>;
  title?: Passthrough<SpanProps>;
  scroller?: Passthrough<ScrollerProps, ScrollerEmits>;
  grid?: Passthrough<GroupProps>;
  footer?: Passthrough<GroupProps>;
  submit?: Passthrough<ButtonProps>;
  reset?: Passthrough<ButtonProps>;
  fields?: Partial<Record<keyof T, DataFormFieldPassthrough>>;
};

export interface DataFormProps<T> {
  form: Form<T>;
  pt?: DataFormPassthrough<T>;
}
