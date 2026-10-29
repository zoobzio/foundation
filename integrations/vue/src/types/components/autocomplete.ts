import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type {
  Entry as QueryEntry,
  Option as QueryOption,
  Service as Query,
} from "@zoobzio/query";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type {
  AutocompleteRootProps,
  AutocompleteRootEmits,
  AutocompleteInputProps,
  AutocompleteInputEmits,
  AutocompleteContentProps,
  AutocompleteViewportProps,
  AutocompleteVirtualizerProps,
  AutocompleteItemProps,
  AutocompleteItemEmits,
} from "reka-ui";

export type { QueryEntry, QueryOption };

/**
 * An item's render position: its panel and its index in that panel. The datum
 * of the iterated parts and the payload of the item slots.
 */
export type AutocompleteAnchor = {
  option: QueryOption;
  index: number;
  panel: number;
};

/**
 * A function ref that reports an item's rendered size to the virtualizer.
 * It takes the item's root element, or the component instance whose `$el`
 * is that element, and `null` when the item unmounts.
 */
export type AutocompleteMeasure = (
  target: Element | ComponentPublicInstance | null,
) => void;

/**
 * A chip's position in the chip row: the committed entry and its index in
 * the query's entries.
 */
export type AutocompleteChipAnchor = {
  entry: QueryEntry;
  index: number;
};

/**
 * The parts of the autocomplete that accept passthrough. `input` adds the
 * native `keydown` emit. `viewport` is the scroll container of the active
 * panel and `virtualizer` windows its options: only the rows in view, plus
 * `overscan` either side, are in the DOM. `estimateSize` seeds a row's
 * height before it is measured.
 */
export type AutocompletePassthrough = {
  root: Passthrough<AutocompleteRootProps, AutocompleteRootEmits>;
  input: Passthrough<
    AutocompleteInputProps,
    AutocompleteInputEmits & { keydown: [event: KeyboardEvent] }
  >;
  content: Passthrough<AutocompleteContentProps>;
  viewport: Passthrough<AutocompleteViewportProps>;
  virtualizer: Passthrough<AutocompleteVirtualizerProps<QueryOption>>;
  item: PassthroughIter<
    AutocompleteAnchor,
    AutocompleteItemProps,
    AutocompleteItemEmits
  >;
};

/**
 * Props of the autocomplete: the headless query service plus passthrough.
 * The component owns only `open`. The query owns the entries, the draft,
 * and the panels.
 */
export type AutocompleteProps = {
  service: Query;
  empty?: boolean;
  placeholder?: string;
  disabled?: boolean;
  open?: boolean;
  pt?: PT<AutocompletePassthrough>;
};

/**
 * Emits of the autocomplete.
 */
export type AutocompleteEmits = {
  "update:open": [value: boolean];
};

/**
 * The autocomplete view model, served to `defineExpose` and the slots.
 */
export type AutocompleteContext = {
  service: Query;
  empty: boolean;
  placeholder: string;
  disabled?: boolean;
  open: Ref<boolean>;
  el: ComponentPublicInstance | null;
  settings: AutocompletePassthrough;
};

/**
 * The payload of an item slot: the context plus the item's anchor. An item
 * of the active panel is virtualized: it also receives `measure`, a ref to
 * put on its root element so the virtualizer sizes the row from the DOM. A
 * virtualized item must render exactly one root element. A trail item has
 * no `measure`.
 */
export type AutocompleteOptionContext = AutocompleteContext &
  AutocompleteAnchor & { measure?: AutocompleteMeasure };

/**
 * The payload of a chip slot: the context plus the chip's anchor.
 */
export type AutocompleteChipContext = AutocompleteContext &
  AutocompleteChipAnchor;

/**
 * Slots of the autocomplete. Each slot receives the context.
 */
export type AutocompleteSlots = {
  chips?: (props: AutocompleteContext) => VNode[];
  chip?: (props: AutocompleteChipContext) => VNode[];
  hint?: (props: AutocompleteContext) => VNode[];
  input?: (props: AutocompleteContext) => VNode[];
  item?: (props: AutocompleteOptionContext) => VNode[];
  itemLabel?: (props: AutocompleteOptionContext) => VNode[];
  itemArrow?: (props: AutocompleteOptionContext) => VNode[];
  empty?: (props: AutocompleteContext) => VNode[];
  itemPrepend?: (props: AutocompleteOptionContext) => VNode[];
  itemAppend?: (props: AutocompleteOptionContext) => VNode[];
};

/**
 * An autocomplete instance as data: props plus emit listeners.
 */
export type AutocompleteDefinition = Definition<
  AutocompleteProps,
  AutocompleteEmits
>;
