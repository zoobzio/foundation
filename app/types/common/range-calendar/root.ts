import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  DateRange,
  RangeCalendarRoot,
  RangeCalendarRootProps as RekaRangeCalendarRootProps,
} from "reka-ui";

export type RangeCalendarRootForward = Reshape<RekaRangeCalendarRootProps, "modelValue">;

// `modelValue` is required: the calendar uses the explicit model contract
// (core MIGRATION § explicit models) — presence on the vnode decides
// controlled-ness, so the consumer must always provide the prop, `undefined`
// included.
export type RangeCalendarRootProps = RekaRangeCalendarRootProps & {
  modelValue: DateRange | null | undefined;
  modifiers?: ModifierProps<"range-calendar-root">;
  tokens?: TokenProps<"range-calendar-root">;
  aria?: AriaProps<"range-calendar-root">;
};

// reka's RangeCalendarRootEmits also carries update:validModelValue /
// update:placeholder / update:startValue; those fall through as attrs
// (README § behavioral elements). The root declares only the model emit
// useModel needs — widened to include `undefined` for the explicit contract.
export type RangeCalendarRootEmits = {
  "update:modelValue": [value: DateRange | undefined];
} & ComponentEvents["range-calendar-root"];

export type RangeCalendarRootBindings = Bindings<"range-calendar-root", RangeCalendarRootForward>;

export type RangeCalendarRootContext = Reshape<RangeCalendarRootProps, "modelValue"> & {
  modelValue: Ref<DateRange | undefined>;
  bindings: RangeCalendarRootBindings;
  el: ComponentPublicInstance | null;
};

// The render-scope payload reka delivers through the root's default slot
// (weekDays, grid, …), derived from the imported component. Core reuses this
// so it never reaches for reka types directly.
export type RangeCalendarRootSlotProps = SlotProps<typeof RangeCalendarRoot>;

// The payload's `modelValue` snapshot is excluded: ctx already carries the
// model as the writable ref, which stays authoritative in the slot scope.
export type RangeCalendarRootSlots = {
  default(
    props: RangeCalendarRootContext & Omit<RangeCalendarRootSlotProps, "modelValue">,
  ): VNode[];
};
