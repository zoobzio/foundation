import type { AriaProps } from "#foundation/types/aria";
import type { Bindings } from "#foundation/types/bindings";
import type { ComponentEvents } from "#foundation/types/events";
import type { ModifierProps } from "#foundation/types/modifiers";
import type { TokenProps } from "#foundation/types/tokens";
import type { SlotProps } from "#foundation/types/slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerCalendar } from "reka-ui";

// reka's DatePickerCalendar declares no props — it is a pure render-scope
// payload provider, so the wrapper's surface is the channels alone.
export type DatePickerCalendarProps = {
  modifiers?: ModifierProps<"date-picker-calendar">;
  tokens?: TokenProps<"date-picker-calendar">;
  aria?: AriaProps<"date-picker-calendar">;
};

export type DatePickerCalendarEmits = ComponentEvents["date-picker-calendar"];

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
