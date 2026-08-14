import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { SlotProps } from "../../slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerCalendar } from "reka-ui";

// reka's DatePickerCalendar declares no props — it is a pure render-scope
// payload provider, so the wrapper's surface is the channels alone.
export type DatePickerCalendarProps = {
  modifiers?: ModifierProps<"date-picker-calendar">;
  tokens?: TokenProps<"date-picker-calendar">;
  aria?: AriaProps<"date-picker-calendar">;
};

export type DatePickerCalendarEmits = {};

export type DatePickerCalendarBindings = Bindings<"date-picker-calendar">;

export type DatePickerCalendarContext = {
  modifiers?: ModifierProps<"date-picker-calendar">;
  tokens?: TokenProps<"date-picker-calendar">;
  aria?: AriaProps<"date-picker-calendar">;
  bindings: DatePickerCalendarBindings;
  el: ComponentPublicInstance | null;
};

// The render-scope payload reka delivers through the calendar's default slot
// (weekDays, grid, …), derived from the imported component. Core reuses this
// so it never reaches for reka types directly.
export type DatePickerCalendarSlotProps = SlotProps<typeof DatePickerCalendar>;

export type DatePickerCalendarSlots = {
  default(
    props: DatePickerCalendarContext & DatePickerCalendarSlotProps,
  ): VNode[];
};
