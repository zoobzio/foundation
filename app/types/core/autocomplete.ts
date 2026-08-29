import type { ScrollerProps } from "./scroller";
import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";
import type { Option } from "./common";
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
 * A suggestion, trail entry, or committed chip. `active` marks the trail
 * option whose children form the current panel; `meta` carries
 * consumer-defined data through untouched.
 */
export type AutocompleteOption<M = unknown> = Option & {
  hasChildren?: boolean;
  active?: boolean;
  meta?: M;
};

/**
 * An item's render position: the panel it sits in and its index there. The
 * iterated parts' datum and the item slots' payload.
 */
export type AutocompleteAnchor<M = unknown> = {
  option: AutocompleteOption<M>;
  index: number;
  panel: number;
};

/**
 * A committed step's render position in the inline chip row.
 */
export type AutocompleteChipAnchor<M = unknown> = {
  option: AutocompleteOption<M>;
  index: number;
};

export type AutocompletePassthrough<M = unknown> = {
  root: Passthrough<AutocompleteRootProps, AutocompleteRootEmits>;
  // widened with the native keydown surface (README § widening)
  input: Passthrough<
    AutocompleteInputProps,
    AutocompleteInputEmits & { keydown: [event: KeyboardEvent] }
  >;
  // widened with capture-phase scroll (scroll does not bubble): the panels'
  // viewports scroll, the content observes, and near-end emits `more`
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
 * The component owns interaction state only (input text, open). The query
 * artifacts are projections of whatever store assembles them — the component
 * renders them and emits `select` / `unwind` / `submit`, and never writes
 * them:
 *
 * - `steps` — committed steps, rendered as inline chips beside the input,
 *   always visible.
 * - `items` — the active suggestion panel.
 * - `trail` — ancestor panels of the current drill, rendered to the left of
 *   `items` so nested options cascade as new panels to the right.
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

export type AutocompleteEmits<M = unknown> = {
  "update:modelValue": [value: string];
  "update:open": [value: boolean];
  select: [item: AutocompleteOption<M>];
  submit: [value: string];
  unwind: [index: number];
  /** The active panel scrolled near its end — extend `items` if more exist. */
  more: [];
  /**
   * Backspace on an empty input with chips present — the consumer removes
   * the last step and may restore its text form to the input for editing.
   */
  unwrap: [];
};

export type AutocompleteContext<M = unknown> = {
  items: AutocompleteOption<M>[];
  steps: AutocompleteOption<M>[];
  trail: AutocompleteOption<M>[][];
  hint: string;
  empty: boolean;
  placeholder: string;
  disabled?: boolean;
  modelValue: Ref<string | undefined>;
  open: Ref<boolean | undefined>;
  panels: AutocompleteOption<M>[][];
  el: ComponentPublicInstance | null;
  settings: AutocompletePassthrough<M>;
};

export type AutocompleteOptionContext<M = unknown> = AutocompleteContext<M> &
  AutocompleteAnchor<M>;

export type AutocompleteChipContext<M = unknown> = AutocompleteContext<M> &
  AutocompleteChipAnchor<M>;

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
