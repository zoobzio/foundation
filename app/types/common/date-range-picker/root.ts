import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { Reshape } from "../../reshape";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  DateRange,
  DateRangePickerRootProps as RekaDateRangePickerRootProps,
} from "reka-ui";

export type DateRangePickerRootForward = Reshape<
  RekaDateRangePickerRootProps,
  "modelValue" | "open"
>;

// `modelValue` is required: the picker uses the explicit model contract
// (core MIGRATION § explicit models) — presence on the vnode decides
// controlled-ness, so the consumer must always provide the prop, `undefined`
// included.
export type DateRangePickerRootProps = RekaDateRangePickerRootProps & {
  modelValue: DateRange | null | undefined;
  modifiers?: ModifierProps<"date-range-picker-root">;
  tokens?: TokenProps<"date-range-picker-root">;
  aria?: AriaProps<"date-range-picker-root">;
};

// reka's DateRangePickerRootEmits also carries update:placeholder /
// update:startValue; those fall through as attrs (README § behavioral
// elements). The root declares only the model emits useModel needs — the
// value emit widened to include `undefined` for the explicit contract.
export type DateRangePickerRootEmits = {
  "update:modelValue": [value: DateRange | undefined];
  "update:open": [value: boolean];
} & {};

export type DateRangePickerRootBindings = Bindings<
  "date-range-picker-root",
  DateRangePickerRootForward
>;

export type DateRangePickerRootContext = Reshape<
  DateRangePickerRootProps,
  "modelValue" | "open"
> & {
  modelValue: Ref<DateRange | undefined>;
  open: Ref<boolean | undefined>;
  bindings: DateRangePickerRootBindings;
  el: ComponentPublicInstance | null;
};

export type DateRangePickerRootSlots = {
  default(props: DateRangePickerRootContext): VNode[];
};
