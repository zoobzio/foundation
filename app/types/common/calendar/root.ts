import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { Reshape } from "#foundation/types/reshape";
import type { SlotProps } from "#foundation/types/slots";
import type { DateValue } from "@internationalized/date";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  CalendarRoot,
  CalendarRootProps as RekaCalendarRootProps,
} from "reka-ui";

export type CalendarRootForward = Reshape<RekaCalendarRootProps, "modelValue">;

// `modelValue` is required: the calendar uses the explicit model contract
// (core MIGRATION § explicit models) — presence on the vnode decides
// controlled-ness, so the consumer must always provide the prop, `undefined`
// included.
export type CalendarRootProps = RekaCalendarRootProps & {
  modelValue: DateValue | null | undefined;
  modifiers?: ModifierProps<"calendar-root">;
  tokens?: TokenProps<"calendar-root">;
  aria?: AriaProps<"calendar-root">;
};

// reka's CalendarRootEmits also carries update:placeholder; it falls through
// as an attr (README § behavioral elements). The root declares only the model
// emit useModel needs.
export type CalendarRootEmits = {
  "update:modelValue": [date: DateValue | undefined];
} & ComponentEvents["calendar-root"];

export type CalendarRootBindings = Bindings<"calendar-root", CalendarRootForward>;

export type CalendarRootContext = Reshape<CalendarRootProps, "modelValue"> & {
  modelValue: Ref<DateValue | undefined>;
  bindings: CalendarRootBindings;
  el: ComponentPublicInstance | null;
};

// The render-scope payload reka delivers through the root's default slot
// (weekDays, grid, …), derived from the imported component. Core reuses this
// so it never reaches for reka types directly.
export type CalendarRootSlotProps = SlotProps<typeof CalendarRoot>;

// The payload's `modelValue` snapshot is excluded: ctx already carries the
// model as the writable ref, which stays authoritative in the slot scope.
export type CalendarRootSlots = {
  default(
    props: CalendarRootContext & Omit<CalendarRootSlotProps, "modelValue">,
  ): VNode[];
};
