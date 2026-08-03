import type { GroupProps } from "#foundation/types/common/group";
import type { InputProps, InputEmits } from "#foundation/types/common/input";
import type { SpanProps } from "#foundation/types/common/span";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
import type {
  ScrollerEmits,
  ScrollerProps,
} from "#foundation/types/core/scroller";
import type { Service, Events } from "#foundation/types/data/autocomplete";
import type {
  AutocompleteItemAnchor,
  AutocompleteItemProps,
  AutocompleteItemSlots,
} from "#foundation/types/data/autocomplete/item";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * The `input` entry widens its component's contract with the native bindings
 * the widget drives (`value`, `keydown`); those are not part of the common
 * contract — they fall through the component to its root element.
 */
export type AutocompleteWidgetPassthrough<M> = {
  root: Passthrough<GroupProps>;
  hint: Passthrough<GroupProps>;
  hintText: Passthrough<SpanProps>;
  hintChar: Passthrough<SpanProps>;
  input: Passthrough<
    InputProps & { value?: string },
    InputEmits & { keydown: [event: KeyboardEvent] }
  >;
  dropdown: Passthrough<GroupProps>;
  panel: Passthrough<GroupProps>;
  scroller: Passthrough<ScrollerProps, ScrollerEmits>;
  item: PassthroughIter<AutocompleteItemAnchor<M>, AutocompleteItemProps<M>>;
  empty: Passthrough<SpanProps>;
};

export type AutocompleteWidgetProps<M> = {
  service: Service<M>;
  pt?: PT<AutocompleteWidgetPassthrough<M>>;
};

export type AutocompleteWidgetEmits<M> = {
  updated: Parameters<Events<M>["autocomplete:updated"]>;
  selected: Parameters<Events<M>["autocomplete:selected"]>;
  submitted: Parameters<Events<M>["autocomplete:submitted"]>;
  unwound: Parameters<Events<M>["autocomplete:unwound"]>;
};

export type AutocompleteWidgetContext<M> = {
  autocomplete: Service<M>;
  el: ComponentPublicInstance | null;
  settings: AutocompleteWidgetPassthrough<M>;
};

export type AutocompleteWidgetSlots<M> = AutocompleteItemSlots<M> & {
  hint?: (props: AutocompleteWidgetContext<M>) => VNode[];
  input?: (props: AutocompleteWidgetContext<M>) => VNode[];
  empty?: (props: AutocompleteWidgetContext<M>) => VNode[];
};
