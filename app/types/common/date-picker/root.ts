import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { DateValue } from "@internationalized/date";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type { DatePickerRootProps as RekaDatePickerRootProps } from "reka-ui";

export type DatePickerRootForward = Reshape<
  RekaDatePickerRootProps,
  "modelValue" | "open"
>;

// `modelValue` is required: the picker uses the explicit model contract
// (core MIGRATION § explicit models) — presence on the vnode decides
// controlled-ness, so the consumer must always provide the prop, `undefined`
// included.
export type DatePickerRootProps = RekaDatePickerRootProps & {
  modelValue: DateValue | null | undefined;
  modifiers?: ModifierProps<"date-picker-root">;
  tokens?: TokenProps<"date-picker-root">;
  aria?: AriaProps<"date-picker-root">;
};

// reka's DatePickerRootEmits also carries update:placeholder; it falls
// through as an attr (README § behavioral elements). The root declares only
// the model emits useModel needs.
export type DatePickerRootEmits = {
  "update:modelValue": [date: DateValue | undefined];
  "update:open": [value: boolean];
} & ComponentEvents["date-picker-root"];

export type DatePickerRootBindings = Bindings<
  "date-picker-root",
  DatePickerRootForward
>;

export type DatePickerRootContext = Reshape<
  DatePickerRootProps,
  "modelValue" | "open"
> & {
  modelValue: Ref<DateValue | undefined>;
  open: Ref<boolean | undefined>;
  bindings: DatePickerRootBindings;
  el: ComponentPublicInstance | null;
};

export type DatePickerRootSlots = {
  default(props: DatePickerRootContext): VNode[];
};
