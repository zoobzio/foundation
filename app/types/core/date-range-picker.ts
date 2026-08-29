import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { SlotProps } from "../slots";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  DateRangePickerField,
  DateRangePickerCalendar,
  DateRangePickerRootProps,
  DateRangePickerRootEmits,
  DateRangePickerInputProps,
  DateRangePickerTriggerProps,
  DateRangePickerContentProps,
  DateRangePickerContentEmits,
  DateRangePickerHeaderProps,
  DateRangePickerHeadingProps,
  DateRangePickerPrevProps,
  DateRangePickerNextProps,
  DateRangePickerGridProps,
  DateRangePickerGridHeadProps,
  DateRangePickerGridBodyProps,
  DateRangePickerGridRowProps,
  DateRangePickerHeadCellProps,
  DateRangePickerCellProps,
  DateRangePickerCellTriggerProps, DateRange 
} from "reka-ui";
import type { DateValue } from "@internationalized/date";

// reka's DateRangePickerField and DateRangePickerCalendar declare no props —
// they are pure render-scope payload providers, so their passthrough surface
// is empty.
export type DateRangePickerFieldProps = Record<string, never>;
export type DateRangePickerCalendarProps = Record<string, never>;

// The render-scope payload reka delivers through the field's default slot
// (start/end segments + a modelValue snapshot), derived from the imported
// component.
export type DateRangePickerFieldSlotProps = SlotProps<typeof DateRangePickerField>;

// One segment of either side of the field's render-scope payload.
export type DateRangePickerSegment =
  DateRangePickerFieldSlotProps["segments"]["start"][number];

// The share of the field's render-scope payload the core template forwards.
export type DateRangePickerSegments = Pick<
  DateRangePickerFieldSlotProps,
  "segments"
>;

// One input part of the field: a segment plus the side of the range it edits.
export type DateRangePickerInputItem = {
  segment: DateRangePickerSegment;
  type: "start" | "end";
};

// The share of the calendar's render-scope payload the core template
// forwards into its slots.
export type DateRangePickerView = Pick<
  SlotProps<typeof DateRangePickerCalendar>,
  "weekDays" | "grid"
>;

// One month of the calendar's render-scope grid payload.
export type DateRangePickerMonth = DateRangePickerView["grid"][number];

export type DateRangePickerPassthrough = {
  root: Passthrough<DateRangePickerRootProps, DateRangePickerRootEmits>;
  field: Passthrough<DateRangePickerFieldProps>;
  input: PassthroughIter<DateRangePickerInputItem, DateRangePickerInputProps>;
  trigger: Passthrough<DateRangePickerTriggerProps>;
  content: Passthrough<DateRangePickerContentProps, DateRangePickerContentEmits>;
  calendar: Passthrough<DateRangePickerCalendarProps>;
  header: Passthrough<DateRangePickerHeaderProps>;
  prev: Passthrough<DateRangePickerPrevProps>;
  heading: Passthrough<DateRangePickerHeadingProps>;
  next: Passthrough<DateRangePickerNextProps>;
  grid: Passthrough<DateRangePickerGridProps>;
  gridHead: Passthrough<DateRangePickerGridHeadProps>;
  gridBody: Passthrough<DateRangePickerGridBodyProps>;
  gridRow: Passthrough<DateRangePickerGridRowProps>;
  headCell: Passthrough<DateRangePickerHeadCellProps>;
  cell: PassthroughIter<DateValue, DateRangePickerCellProps>;
  cellTrigger: PassthroughIter<
    { day: DateValue; month: DateValue },
    DateRangePickerCellTriggerProps
  >;
};

// `modelValue` is required: the picker uses the explicit model contract
// (MIGRATION § explicit models) — presence on the vnode decides
// controlled-ness, so consumers always provide it, `undefined` included.
export type DateRangePickerProps = {
  modelValue: DateRange | undefined;
  open?: boolean;
  pt?: PT<DateRangePickerPassthrough>;
};

export type DateRangePickerEmits = {
  "update:modelValue": [value: DateRange | undefined];
  "update:open": [value: boolean];
};

export type DateRangePickerContext = {
  modelValue: Ref<DateRange | undefined>;
  open: Ref<boolean | undefined>;
  el: ComponentPublicInstance | null;
  settings: DateRangePickerPassthrough;
};

export type DateRangePickerSlots = {
  field?: (props: DateRangePickerContext & DateRangePickerSegments) => VNode[];
  input?: (props: DateRangePickerContext & DateRangePickerInputItem) => VNode[];
  separator?: (props: DateRangePickerContext) => VNode[];
  trigger?: (props: DateRangePickerContext) => VNode[];
  triggerIcon?: (props: DateRangePickerContext) => VNode[];
  content?: (props: DateRangePickerContext) => VNode[];
  header?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  prev?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  prevIcon?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  heading?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  next?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  nextIcon?: (props: DateRangePickerContext & DateRangePickerView) => VNode[];
  grid?: (props: DateRangePickerContext & DateRangePickerView & { month: DateRangePickerMonth }) => VNode[];
  gridHead?: (props: DateRangePickerContext & DateRangePickerView & { month: DateRangePickerMonth }) => VNode[];
  gridBody?: (props: DateRangePickerContext & DateRangePickerView & { month: DateRangePickerMonth }) => VNode[];
  headCell?: (props: DateRangePickerContext & { day: string }) => VNode[];
  cell?: (props: DateRangePickerContext & { month: DateRangePickerMonth; date: DateValue }) => VNode[];
  cellTrigger?: (props: DateRangePickerContext & { month: DateRangePickerMonth; date: DateValue }) => VNode[];
};
