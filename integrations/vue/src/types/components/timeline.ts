import type { MenuEmits, MenuProps } from "./menu";
import type { SyncItem } from "./sync";
import type { AutocompleteEmits, AutocompleteProps } from "./autocomplete";
import type { FabEmits, FabProps } from "./fab";
import type {
  Passthrough,
  PassthroughIter,
  PT,
  Rendered,
} from "../passthrough";
import type { Definition } from "../definition";
import type { Events, RecordData, Service } from "@zoobzio/timeline";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  VNode,
} from "vue";

/**
 * One record as a card reads it: its key, the record itself, its name,
 * and its time, as text in the timeline's zone and as the instant it is.
 * A record whose time does not read as one has neither.
 */
export interface TimelineItem<T extends RecordData> {
  key: string;
  record: T;
  label: string;
  time: string;
  datetime: string | undefined;
}

/**
 * One group as rendered: the records that share a day, a month, or a
 * year, under what the span reads as. `key` is the span, `YYYY-MM-DD`,
 * `YYYY-MM`, or `YYYY`, and `id` tells one group from another where two
 * share a key. `label` is empty for the one group of a timeline that
 * groups by nothing, which has no heading. `today` says today falls in
 * the span.
 */
export interface TimelineGroup<T extends RecordData> {
  id: string;
  key: string;
  label: string;
  today: boolean;
  items: TimelineItem<T>[];
}

/**
 * The parts of the timeline that accept passthrough. `search` is the
 * autocomplete over the timeline's search machine, where the service is
 * searchable, and `refresh` fetches the records anew, or where the
 * timeline has a sync is the trigger of `syncMenu`: the controls, a row
 * of their own over the timeline. `groups` is the list of the groups,
 * `group` each of them, and `heading` its heading; `record` is the card
 * of each record, and `label` the button inside it that selects it;
 * `more` is the button that loads the batch after the records held.
 */
export type TimelinePassthrough<T extends RecordData> = {
  search: Rendered<AutocompleteProps, AutocompleteEmits>;
  refresh: Rendered<FabProps, FabEmits>;
  syncMenu: Rendered<MenuProps<SyncItem>, MenuEmits<SyncItem>>;
  groups: Passthrough<OlHTMLAttributes>;
  group: PassthroughIter<TimelineGroup<T>, LiHTMLAttributes>;
  heading: PassthroughIter<TimelineGroup<T>, HTMLAttributes>;
  record: PassthroughIter<TimelineItem<T>, HTMLAttributes>;
  label: PassthroughIter<TimelineItem<T>, ButtonHTMLAttributes>;
  more: Rendered<FabProps & ButtonHTMLAttributes, FabEmits>;
};

/**
 * Props of the timeline: the headless service plus passthrough. The
 * timeline owns no feature state. The service's state container must be
 * reactive for the timeline to update.
 */
export type TimelineProps<T extends RecordData> = {
  service: Service<T>;
  pt?: PT<TimelinePassthrough<T>>;
};

/**
 * Emits of the timeline: the service's domain events, relayed with the
 * service's payloads. Literal keys, not a `Pick`: `@vue/compiler-sfc` must
 * fold the emit keys statically for `defineEmits`. `TIMELINE_EVENTS` names
 * the relayed subset and is checked against these keys.
 */
export type TimelineEmits<T extends RecordData> = {
  loaded: Events<T>["loaded"];
  appended: Events<T>["appended"];
  selected: Events<T>["selected"];
  filtered: Events<T>["filtered"];
  restored: Events<T>["restored"];
};

/**
 * The timeline view model, served to `defineExpose` and the slots.
 */
export type TimelineContext<T extends RecordData> = {
  timeline: Service<T>;
  /** The groups, each with its records as cards read them. */
  groups: TimelineGroup<T>[];
  el: HTMLDivElement | null;
  settings: TimelinePassthrough<T>;
};

/**
 * Slots of the timeline. `controls` replaces the row over the timeline,
 * `search` its search, where the service is searchable, and `refresh` its
 * refresh button, which is the sync menu's trigger where the timeline has
 * a sync; `syncPrepend` and `syncAppend` sit around each of that menu's
 * items, and `syncLabel` replaces an item's label. `group` replaces a
 * group's content, and `heading` its heading. `record` replaces a
 * record's card: the slot a consumer draws its own card in.
 * `recordPrepend` and `recordAppend` add to the card before and after
 * what it holds, `recordLabel` fills the button that selects the record,
 * and `recordTime` replaces its time. `empty` is what the timeline shows
 * with no record, and `more` replaces the button that loads the next
 * batch.
 */
export type TimelineSlots<T extends RecordData> = {
  controls?: (props: TimelineContext<T>) => VNode[];
  search?: (props: TimelineContext<T>) => VNode[];
  refresh?: (props: TimelineContext<T>) => VNode[];
  syncPrepend?: (props: TimelineContext<T> & { item: SyncItem }) => VNode[];
  syncLabel?: (props: TimelineContext<T> & { item: SyncItem }) => VNode[];
  syncAppend?: (props: TimelineContext<T> & { item: SyncItem }) => VNode[];
  group?: (props: TimelineContext<T> & { group: TimelineGroup<T> }) => VNode[];
  heading?: (
    props: TimelineContext<T> & { group: TimelineGroup<T> },
  ) => VNode[];
  record?: (
    props: TimelineContext<T> & {
      group: TimelineGroup<T>;
      item: TimelineItem<T>;
    },
  ) => VNode[];
  recordPrepend?: (
    props: TimelineContext<T> & {
      group: TimelineGroup<T>;
      item: TimelineItem<T>;
    },
  ) => VNode[];
  recordLabel?: (
    props: TimelineContext<T> & {
      group: TimelineGroup<T>;
      item: TimelineItem<T>;
    },
  ) => VNode[];
  recordTime?: (
    props: TimelineContext<T> & {
      group: TimelineGroup<T>;
      item: TimelineItem<T>;
    },
  ) => VNode[];
  recordAppend?: (
    props: TimelineContext<T> & {
      group: TimelineGroup<T>;
      item: TimelineItem<T>;
    },
  ) => VNode[];
  empty?: (props: TimelineContext<T>) => VNode[];
  more?: (props: TimelineContext<T>) => VNode[];
};

/**
 * A timeline instance as data: props plus emit listeners.
 */
export type TimelineDefinition<T extends RecordData> = Definition<
  TimelineProps<T>,
  TimelineEmits<T>
>;
