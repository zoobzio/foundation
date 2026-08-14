import type { AriaProps } from "../../aria";
import type { Bindings } from "../../bindings";
import type { ComponentEvents } from "../../events";
import type { ModifierProps } from "../../modifiers";
import type { TokenProps } from "../../tokens";
import type { SlotProps } from "../../slots";
import type { ComponentPublicInstance, VNode } from "vue";
import type { DatePickerField } from "reka-ui";

// reka's DatePickerField declares no props — it is a pure render-scope
// payload provider, so the wrapper's surface is the channels alone.
export type DatePickerFieldProps = {
  modifiers?: ModifierProps<"date-picker-field">;
  tokens?: TokenProps<"date-picker-field">;
  aria?: AriaProps<"date-picker-field">;
};

export type DatePickerFieldEmits = ComponentEvents["date-picker-field"];

export type DatePickerFieldBindings = Bindings<"date-picker-field">;

export type DatePickerFieldContext = {
  modifiers?: ModifierProps<"date-picker-field">;
  tokens?: TokenProps<"date-picker-field">;
  aria?: AriaProps<"date-picker-field">;
  bindings: DatePickerFieldBindings;
  el: ComponentPublicInstance | null;
};

// The render-scope payload reka delivers through the field's default slot
// (segments + a modelValue snapshot), derived from the imported component.
export type DatePickerFieldSlotProps = SlotProps<typeof DatePickerField>;

// One segment of the field's render-scope payload.
export type DatePickerSegment = DatePickerFieldSlotProps["segments"][number];

// The payload's `modelValue` snapshot is excluded: the root's ctx carries the
// model as the writable ref, which stays authoritative.
export type DatePickerFieldSlots = {
  default(
    props: DatePickerFieldContext & Omit<DatePickerFieldSlotProps, "modelValue">,
  ): VNode[];
};
