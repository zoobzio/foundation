import type { CaptionProps } from "#foundation/types/common/caption";
import type { GroupProps } from "#foundation/types/common/group";
import type { LabelProps } from "#foundation/types/common/label";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { Control, Controls } from "#foundation/types/data/controls";
import type { Field, Form } from "#foundation/types/data/form";
import type { ComponentPublicInstance, VNode } from "vue";

export type FormFieldPassthrough = {
  root: Passthrough<GroupProps>;
  label: Passthrough<LabelProps>;
  error: Passthrough<CaptionProps>;
} & Controls;

export interface FormFieldProps<T> {
  form: Form<T>;
  field: Field<T>;
  pt?: PT<FormFieldPassthrough>;
}

export type FormFieldContext<T> = {
  form: Form<T>;
  field: Field<T>;
  value: T[keyof T] | undefined;
  error: string | undefined;
  el: ComponentPublicInstance | null;
  control: Control;
  settings: FormFieldPassthrough;
};

export type FormFieldSlots<T> = {
  label?: (props: FormFieldContext<T>) => VNode[];
  input?: (props: FormFieldContext<T>) => VNode[];
  textarea?: (props: FormFieldContext<T>) => VNode[];
  select?: (props: FormFieldContext<T>) => VNode[];
  multiSelect?: (props: FormFieldContext<T>) => VNode[];
  checkbox?: (props: FormFieldContext<T>) => VNode[];
  radio?: (props: FormFieldContext<T>) => VNode[];
  datePicker?: (props: FormFieldContext<T>) => VNode[];
  tagsInput?: (props: FormFieldContext<T>) => VNode[];
  error?: (props: FormFieldContext<T>) => VNode[];
};
