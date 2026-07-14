import type { ButtonProps } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { SpanProps } from "#foundation/types/common/span";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { ScrollerEmits, ScrollerProps } from "#foundation/types/core/scroller";
import type { Form } from "#foundation/types/data/form";
import type { DataFormFieldPassthrough } from "#foundation/types/data/form-field";

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
