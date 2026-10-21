import type { ScrollerProps } from "./scroller";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type { Option } from "../common";
import type { Definition } from "../definition";
import type {
  AutocompleteRootProps,
  AutocompleteRootEmits,
  AutocompleteInputProps,
  AutocompleteInputEmits,
  AutocompleteContentProps,
  AutocompleteItemProps,
  AutocompleteItemEmits,
} from "reka-ui";

/**
 * A suggestion, trail entry, or committed step. `active` marks the trail option
 * whose children form the current panel. `meta` carries consumer data through
 * unchanged.
 */
export type AutocompleteOption<M = unknown> = Option & {
  hasChildren?: boolean;
  active?: boolean;
  meta?: M;
};

/**
 * An item's render position: its panel and its index in that panel. The datum
 * of the iterated parts and the payload of the item slots.
 */
export type AutocompleteAnchor<M = unknown> = {
  option: AutocompleteOption<M>;
  index: number;
  panel: number;
};

/**
 * A committed step's position in the chip row.
 */
export type AutocompleteChipAnchor<M = unknown> = {
  option: AutocompleteOption<M>;
  index: number;
};

/**
 * The parts of the autocomplete that accept passthrough. `input` adds the
 * native `keydown` emit. `content` adds a capture-phase `scroll` emit, because
 * scroll does not bubble from the panel viewports.
 */
export type AutocompletePassthrough<M = unknown> = {
  root: Passthrough<AutocompleteRootProps, AutocompleteRootEmits>;
  input: Passthrough<
    AutocompleteInputProps,
    AutocompleteInputEmits & { keydown: [event: KeyboardEvent] }
  >;
  content: Passthrough<
    AutocompleteContentProps,
    { scrollCapture: [event: Event] }
  >;
  scroller: Passthrough<ScrollerProps>;
  item: PassthroughIter<
    AutocompleteAnchor<M>,
    AutocompleteItemProps,
    AutocompleteItemEmits
  >;
};

/**
 * Props of the autocomplete. The component owns only the input text and `open`.
 * `steps` are committed steps shown as chips. `items` is the active panel.
 * `trail` holds the ancestor panels shown left of `items`.
 */
export type AutocompleteProps<M = unknown> = {
  items: AutocompleteOption<M>[];
  steps?: NoInfer<AutocompleteOption<M>[]>;
  trail?: NoInfer<AutocompleteOption<M>[][]>;
  modelValue?: string;
  hint?: string;
  empty?: boolean;
  placeholder?: string;
  disabled?: boolean;
  open?: boolean;
  pt?: PT<AutocompletePassthrough<M>>;
};

/**
 * Emits of the autocomplete.
 */
export type AutocompleteEmits<M = unknown> = {
  "update:modelValue": [value: string];
  "update:open": [value: boolean];
  select: [item: AutocompleteOption<M>];
  submit: [value: string];
  unwind: [index: number];
  /** The active panel scrolled near its end. Extend `items` if more exist. */
  more: [];
  /** Backspace on an empty input with chips present. The consumer removes the
   * last step. */
  unwrap: [];
};

/**
 * The autocomplete view model, served to `defineExpose` and the slots. `panels`
 * is `trail` plus `items`.
 */
export type AutocompleteContext<M = unknown> = {
  items: AutocompleteOption<M>[];
  steps: AutocompleteOption<M>[];
  trail: AutocompleteOption<M>[][];
  hint: string;
  empty: boolean;
  placeholder: string;
  disabled?: boolean;
  modelValue: Ref<string | undefined>;
  open: Ref<boolean>;
  panels: AutocompleteOption<M>[][];
  el: ComponentPublicInstance | null;
  settings: AutocompletePassthrough<M>;
};

/**
 * The payload of an item slot: the context plus the item's anchor.
 */
export type AutocompleteOptionContext<M = unknown> = AutocompleteContext<M> &
  AutocompleteAnchor<M>;

/**
 * The payload of a chip slot: the context plus the chip's anchor.
 */
export type AutocompleteChipContext<M = unknown> = AutocompleteContext<M> &
  AutocompleteChipAnchor<M>;

/**
 * Slots of the autocomplete. Each slot receives the context.
 */
export type AutocompleteSlots<M = unknown> = {
  chips?: (props: AutocompleteContext<M>) => VNode[];
  chip?: (props: AutocompleteChipContext<M>) => VNode[];
  hint?: (props: AutocompleteContext<M>) => VNode[];
  input?: (props: AutocompleteContext<M>) => VNode[];
  item?: (props: AutocompleteOptionContext<M>) => VNode[];
  itemIcon?: (props: AutocompleteOptionContext<M>) => VNode[];
  itemLabel?: (props: AutocompleteOptionContext<M>) => VNode[];
  itemArrow?: (props: AutocompleteOptionContext<M>) => VNode[];
  empty?: (props: AutocompleteContext<M>) => VNode[];
};

/**
 * An autocomplete instance as data: props plus emit listeners.
 */
export type AutocompleteDefinition<M = unknown> = Definition<
  AutocompleteProps<M>,
  AutocompleteEmits<M>
>;
