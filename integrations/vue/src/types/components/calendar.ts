import type { Text } from "@zoobzio/kit";
import type { AutocompleteEmits, AutocompleteProps } from "./autocomplete";
import type { FabEmits, FabProps } from "./fab";
import type {
  Passthrough,
  PassthroughIter,
  PT,
  Rendered,
  RenderedIter,
} from "../passthrough";
import type { Definition } from "../definition";
import type { Day, Events, Occurrence, Service } from "@zoobzio/calendar";
import type { ToolbarRootProps, ToolbarSeparatorProps } from "reka-ui";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
  VNode,
} from "vue";

/**
 * What a tool does when pressed. A `toggle` shows a view and reports
 * `aria-pressed` while the calendar is in it; an `action` runs once
 * (today, previous, next) and is never pressed.
 */
export type CalendarToolKind = "toggle" | "action";

/**
 * The groups of the toolbar, in order: the navigation (today, previous,
 * next), then the views. The heading stands after the navigation, and a
 * separator between one group and the next.
 */
export type CalendarToolGroup = "navigate" | "views";

/**
 * One tool of the toolbar: a button over one command of the service. `key`
 * names the action (`today`, `prev`, `next`) or the view (`month`, `week`,
 * `day`, `agenda`); `active` is the view the calendar is in; `disabled`
 * says the command would change nothing (today, on today).
 */
export interface CalendarTool {
  key: string;
  label: Text;
  kind: CalendarToolKind;
  group: CalendarToolGroup;
  active: boolean;
  disabled: boolean;
  run: () => void;
}

/**
 * One group of the toolbar as rendered: its name and its tools, in order.
 * Only groups that hold a tool are rendered.
 */
export interface CalendarGroup {
  name: CalendarToolGroup;
  tools: CalendarTool[];
}

/**
 * One column heading of the grid: a day of the week, short as the heading
 * reads and long as its accessible name.
 */
export interface CalendarWeekday {
  key: string;
  label: string;
  name: string;
}

/**
 * One day the view shows: its date, its number as a cell reads, its full
 * date as an accessible name, whether it is today, whether it lies outside
 * the month the view is anchored on, and the occurrences that touch it.
 */
export interface CalendarDay {
  date: Day;
  label: string;
  name: string;
  today: boolean;
  outside: boolean;
  occurrences: Occurrence[];
}

/**
 * The parts of the calendar that accept passthrough. `search` is the
 * autocomplete over the calendar's search machine, where the service is
 * searchable, and `refresh` refetches the range: the controls, a row of
 * their own over the calendar. `toolbar` is reka's toolbar root, which
 * gives the tools one tab stop and arrow-key focus; `separator` is the
 * divider between two groups; `tool` is each button, built per tool, a
 * Fab rendered through `Primitive` with the tool's label as its
 * accessible name; `grid` is the table of the month, week, and day
 * views, and `agenda` the list of the agenda view;
 * `weekday`, `day`, `dayLabel`, and `occurrence` are built per item.
 */
export type CalendarPassthrough = {
  search: Rendered<AutocompleteProps, AutocompleteEmits>;
  refresh: Rendered<FabProps, FabEmits>;
  toolbar: Passthrough<ToolbarRootProps & HTMLAttributes>;
  separator: PassthroughIter<
    CalendarGroup,
    ToolbarSeparatorProps & HTMLAttributes
  >;
  tool: RenderedIter<CalendarTool, FabProps & ButtonHTMLAttributes, FabEmits>;
  grid: Passthrough<TableHTMLAttributes>;
  agenda: Passthrough<OlHTMLAttributes>;
  weekday: PassthroughIter<CalendarWeekday, ThHTMLAttributes>;
  day: PassthroughIter<CalendarDay, TdHTMLAttributes & LiHTMLAttributes>;
  dayLabel: PassthroughIter<CalendarDay, ButtonHTMLAttributes>;
  occurrence: PassthroughIter<Occurrence, ButtonHTMLAttributes>;
};

/**
 * Props of the calendar: the headless service plus passthrough. The
 * calendar owns no feature state. The service's state container must be
 * reactive for the calendar to update.
 */
export type CalendarProps<I, O> = {
  service: Service<I, O>;
  pt?: PT<CalendarPassthrough>;
};

/**
 * Emits of the calendar: the service's domain events, relayed with the
 * service's payloads. Literal keys, not a `Pick`: `@vue/compiler-sfc` must
 * fold the emit keys statically for `defineEmits`. `CALENDAR_EVENTS` names
 * the relayed subset and is checked against these keys.
 */
export type CalendarEmits<O> = {
  navigated: Events<O>["navigated"];
  loaded: Events<O>["loaded"];
  changed: Events<O>["changed"];
  selected: Events<O>["selected"];
  filtered: Events<O>["filtered"];
  restored: Events<O>["restored"];
};

/**
 * The calendar view model, served to `defineExpose` and the slots.
 */
export type CalendarContext<I, O> = {
  calendar: Service<I, O>;
  /** What the view shows, as a heading reads it: a month, a span of days, a day. */
  heading: string;
  /** The column headings of the grid: seven, or the one of the day view. */
  weekdays: CalendarWeekday[];
  /** The days of the view, in rows of a week. */
  weeks: CalendarDay[][];
  /** The days of the view, in order. */
  days: CalendarDay[];
  /** The tools of the toolbar, in order. */
  tools: CalendarTool[];
  /** The tools in their groups, the groups that hold one. */
  groups: CalendarGroup[];
  /** The time of an occurrence as a cell reads it. Empty for an all-day one. */
  time: (occurrence: Occurrence) => string;
  /** Opens a day: moves the date to it, in the day view where it is offered. */
  open: (day: Day) => void;
  el: HTMLDivElement | null;
  settings: CalendarPassthrough;
};

/**
 * Slots of the calendar. `controls` replaces the row over the calendar,
 * `search` its search, where the service is searchable, and `refresh` its
 * refresh button. `toolbar` replaces the whole toolbar;
 * `toolbarPrepend` and `toolbarAppend` add controls before and after its
 * tools, inside its focus order; `separator` replaces the divider before a
 * group, given the group; `heading` replaces the heading; `tool` replaces
 * one button, given the tool, roving focus included; `toolPrepend`,
 * `toolLabel`, and `toolAppend` fill the button, so a label slot that
 * draws an icon makes the button icon-only while the tool's label stays
 * its accessible name. `weekday` replaces a column heading's content.
 * `day` replaces a day's content, `dayLabel` its date button, and
 * `occurrence` one occurrence's button; `occurrenceTime` and
 * `occurrenceLabel` fill that button. `empty` is what the agenda shows
 * with no occurrence in its days.
 */
export type CalendarSlots<I, O> = {
  controls?: (props: CalendarContext<I, O>) => VNode[];
  search?: (props: CalendarContext<I, O>) => VNode[];
  refresh?: (props: CalendarContext<I, O>) => VNode[];
  toolbar?: (props: CalendarContext<I, O>) => VNode[];
  toolbarPrepend?: (props: CalendarContext<I, O>) => VNode[];
  toolbarAppend?: (props: CalendarContext<I, O>) => VNode[];
  separator?: (
    props: CalendarContext<I, O> & { group: CalendarGroup },
  ) => VNode[];
  heading?: (props: CalendarContext<I, O>) => VNode[];
  tool?: (props: CalendarContext<I, O> & { tool: CalendarTool }) => VNode[];
  toolPrepend?: (
    props: CalendarContext<I, O> & { tool: CalendarTool },
  ) => VNode[];
  toolLabel?: (
    props: CalendarContext<I, O> & { tool: CalendarTool },
  ) => VNode[];
  toolAppend?: (
    props: CalendarContext<I, O> & { tool: CalendarTool },
  ) => VNode[];
  weekday?: (
    props: CalendarContext<I, O> & { weekday: CalendarWeekday },
  ) => VNode[];
  day?: (props: CalendarContext<I, O> & { day: CalendarDay }) => VNode[];
  dayLabel?: (props: CalendarContext<I, O> & { day: CalendarDay }) => VNode[];
  occurrence?: (
    props: CalendarContext<I, O> & {
      day: CalendarDay;
      occurrence: Occurrence;
    },
  ) => VNode[];
  occurrenceTime?: (
    props: CalendarContext<I, O> & {
      day: CalendarDay;
      occurrence: Occurrence;
    },
  ) => VNode[];
  occurrenceLabel?: (
    props: CalendarContext<I, O> & {
      day: CalendarDay;
      occurrence: Occurrence;
    },
  ) => VNode[];
  empty?: (props: CalendarContext<I, O>) => VNode[];
};

/**
 * A calendar instance as data: props plus emit listeners.
 */
export type CalendarDefinition<I, O> = Definition<
  CalendarProps<I, O>,
  CalendarEmits<O>
>;
