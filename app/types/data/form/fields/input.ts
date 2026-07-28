import type { InputProps } from "#foundation/types/common/input";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { DataFormTextField, Form } from "#foundation/types/data/form";
import type { ComponentPublicInstance } from "vue";

export type FormInputPassthrough = {
  input: Passthrough<InputProps>;
};

export interface FormInputProps<T> {
  form: Form<T>;
  field: DataFormTextField<T>;
  pt?: PT<FormInputPassthrough>;
}

export interface FormInputContext<T> {
  form: Form<T>;
  field: DataFormTextField<T>;
  value: T[keyof T] | undefined;
  error: string | undefined;
  el: ComponentPublicInstance | null;
  settings: FormInputPassthrough;
}
