import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { SlotProps } from "../../slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerCalendar } from "reka-ui";

// reka's DateRangePickerCalendar declares no props — it is a pure render-scope
// payload provider, so the wrapper's surface is the channels alone.
export type DateRangePickerCalendarProps = {
  modifiers?: ModifierProps<"date-range-picker-calendar">;
  tokens?: TokenProps<"date-range-picker-calendar">;
  aria?: AriaProps<"date-range-picker-calendar">;
};

export type DateRangePickerCalendarEmits = {};

export type DateRangePickerCalendarBindings = Bindings<"date-range-picker-calendar">;

export type DateRangePickerCalendarContext = {
  modifiers?: ModifierProps<"date-range-picker-calendar">;
  tokens?: TokenProps<"date-range-picker-calendar">;
  aria?: AriaProps<"date-range-picker-calendar">;
  bindings: DateRangePickerCalendarBindings;
  el: ComponentPublicInstance | null;
};

// The render-scope payload reka delivers through the calendar's default slot
// (weekDays, grid, …), derived from the imported component. Core reuses this
// so it never reaches for reka types directly.
export type DateRangePickerCalendarSlotProps = SlotProps<typeof DateRangePickerCalendar>;

export type DateRangePickerCalendarSlots = {
  default(
    props: DateRangePickerCalendarContext & DateRangePickerCalendarSlotProps,
  ): VNode[];
};
