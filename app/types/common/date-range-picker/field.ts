import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { SlotProps } from "../../slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DateRangePickerField } from "reka-ui";

// reka's DateRangePickerField declares no props — it is a pure render-scope
// payload provider, so the wrapper's surface is the channels alone.
export type DateRangePickerFieldProps = {
  modifiers?: ModifierProps<"date-range-picker-field">;
  tokens?: TokenProps<"date-range-picker-field">;
  aria?: AriaProps<"date-range-picker-field">;
};

export type DateRangePickerFieldEmits = ComponentEvents["date-range-picker-field"];

export type DateRangePickerFieldBindings = Bindings<"date-range-picker-field">;

export type DateRangePickerFieldContext = {
  modifiers?: ModifierProps<"date-range-picker-field">;
  tokens?: TokenProps<"date-range-picker-field">;
  aria?: AriaProps<"date-range-picker-field">;
  bindings: DateRangePickerFieldBindings;
  el: ComponentPublicInstance | null;
};

// The render-scope payload reka delivers through the field's default slot
// (start/end segments + a modelValue snapshot), derived from the imported
// component.
export type DateRangePickerFieldSlotProps = SlotProps<typeof DateRangePickerField>;

// One segment of either side of the field's render-scope payload.
export type DateRangePickerSegment =
  DateRangePickerFieldSlotProps["segments"]["start"][number];

// The payload's `modelValue` snapshot is excluded: the root's ctx carries the
// model as the writable ref, which stays authoritative.
export type DateRangePickerFieldSlots = {
  default(
    props: DateRangePickerFieldContext &
      Omit<DateRangePickerFieldSlotProps, "modelValue">,
  ): VNode[];
};
