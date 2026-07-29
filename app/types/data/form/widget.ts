import type { ButtonProps, ButtonEmits } from "#foundation/types/common/button";
import type { FormProps, FormEmits } from "#foundation/types/common/form";
import type { GroupProps } from "#foundation/types/common/group";
import type { SpanProps } from "#foundation/types/common/span";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type {
  ScrollerEmits,
  ScrollerProps,
} from "#foundation/types/core/scroller";
import type { Form } from "#foundation/types/data/form";
import type {
  FormFieldPassthrough,
  FormFieldSlots,
} from "#foundation/types/data/form/field";
import type { ComponentPublicInstance, VNode } from "vue";

export type FormWidgetPassthrough = {
  root: Passthrough<GroupProps>;
  toolbar: Passthrough<GroupProps>;
  title: Passthrough<SpanProps>;
  scroller: Passthrough<ScrollerProps, ScrollerEmits>;
  inner: Passthrough<FormProps, FormEmits>;
  grid: Passthrough<GroupProps>;
  footer: Passthrough<GroupProps>;
  submit: Passthrough<ButtonProps, ButtonEmits>;
  reset: Passthrough<ButtonProps, ButtonEmits>;
};

export interface FormWidgetProps<T> {
  form: Form<T>;
  pt?: PT<FormWidgetPassthrough> & {
    fields?: Partial<Record<keyof T, PT<FormFieldPassthrough>>>;
  };
}

export type FormWidgetContext<T> = {
  form: Form<T>;
  el: ComponentPublicInstance | null;
  settings: FormWidgetPassthrough;
};

export type FormWidgetSlots<T> = FormFieldSlots<T> & {
  toolbar?: (props: FormWidgetContext<T>) => VNode[];
  footer?: (props: FormWidgetContext<T>) => VNode[];
};
