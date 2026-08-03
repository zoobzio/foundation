import type { ButtonProps, ButtonEmits } from "#foundation/types/common/button";
import type { IconProps } from "#foundation/types/common/icon";
import type { SpanProps } from "#foundation/types/common/span";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { Service, Item } from "#foundation/types/data/autocomplete";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * The `icon` part's alias comes from item data, not passthrough, so it is
 * omitted here and bound explicitly by the template.
 */
export type AutocompleteItemPassthrough = {
  root: Passthrough<ButtonProps, ButtonEmits>;
  icon: Passthrough<Omit<IconProps, "alias">>;
  label: Passthrough<SpanProps>;
  arrow: Passthrough<IconProps>;
};

/**
 * An item's render position: the item itself plus where it sits in the
 * panel grid. The widget's `item` passthrough entry iterates over this,
 * and `useAutocompleteItem` derives panel standing from it.
 */
export type AutocompleteItemAnchor<M> = {
  item: Item<M>;
  index: number;
  panel: number;
};

export type AutocompleteItemProps<M> = AutocompleteItemAnchor<M> & {
  autocomplete: Service<M>;
  pt?: PT<AutocompleteItemPassthrough>;
};

export type AutocompleteItemContext<M> = AutocompleteItemAnchor<M> & {
  autocomplete: Service<M>;
  locked: boolean;
  highlighted: boolean;
  el: ComponentPublicInstance | null;
  settings: AutocompleteItemPassthrough;
};

export type AutocompleteItemSlots<M> = {
  icon?: (props: AutocompleteItemContext<M>) => VNode[];
  label?: (props: AutocompleteItemContext<M>) => VNode[];
  arrow?: (props: AutocompleteItemContext<M>) => VNode[];
};
