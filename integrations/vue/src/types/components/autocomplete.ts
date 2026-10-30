import type { ScrollerProps } from "./scroller";
import type {
  Passthrough,
  PassthroughIter,
  PT,
  Rendered,
} from "../passthrough";
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
 * A chip's position in the chip row: the committed entry and its index in
 * the query's entries.
 */
export type AutocompleteChipAnchor = {
  entry: QueryEntry;
  index: number;
};

/**
 * The parts of the autocomplete that accept passthrough. `input` adds the
 * native `keydown` emit. `viewport` is the scroll area of the first panel,
 * the one open before any selection, the package's scroller by default.
 * Once a group has an option set, the active panel renders in a plain
 * `.f-autocomplete-viewport` element instead and `viewport` does not
 * apply. `virtualizer` windows the active panel's options in either: only
 * the rows in view, plus `overscan` either side, are in the DOM.
 * `estimateSize` seeds a row's height before it is measured. The
 * virtualizer scrolls with its parent element, so the scroller's viewport
 * renders it as its own child; a `viewport` override keeps that `pt`
 * unless it sets its own.
 */
export type AutocompletePassthrough = {
  root: Passthrough<AutocompleteRootProps, AutocompleteRootEmits>;
  input: Passthrough<
    AutocompleteInputProps,
    AutocompleteInputEmits & { keydown: [event: KeyboardEvent] }
  >;
  content: Passthrough<AutocompleteContentProps>;
  viewport: Rendered<ScrollerProps>;
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
 * of the active panel renders within a row the component owns: the
 * virtualizer positions and measures that row, so the item may render any
 * content and need not report its size.
 */
export type AutocompleteOptionContext = AutocompleteContext &
  AutocompleteAnchor;

/**
 * The payload of a chip slot: the context plus the chip's anchor.
 */
export type AutocompleteChipContext = AutocompleteContext &
  AutocompleteChipAnchor;

/**
 * Slots of the autocomplete. Each slot receives the context. `inputPrepend`
 * leads the root, before the chips, so an icon leads the whole field.
 * `inputAppend` trails the input and its hint, within the group the content
 * anchors to, so a key hint trails the input. The order is prepend, chips,
 * input, append.
 * `chipPrepend` and `chipAppend` sit either side of a chip's label, within
 * the button that removes it, so a remove icon can trail the label.
 */
export type AutocompleteSlots = {
  chips?: (props: AutocompleteContext) => VNode[];
  chip?: (props: AutocompleteChipContext) => VNode[];
  chipPrepend?: (props: AutocompleteChipContext) => VNode[];
  chipAppend?: (props: AutocompleteChipContext) => VNode[];
  hint?: (props: AutocompleteContext) => VNode[];
  inputPrepend?: (props: AutocompleteContext) => VNode[];
  input?: (props: AutocompleteContext) => VNode[];
  inputAppend?: (props: AutocompleteContext) => VNode[];
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
