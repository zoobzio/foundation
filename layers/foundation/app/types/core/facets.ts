import type { CommandProps, CommandEmits } from "./command";
import type { FabProps } from "./fab";
import type { PopoverProps, PopoverEmits } from "./popover";
import type { Passthrough, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * A single facet value with its result count. The view-side home of the
 * facet shapes; `@zoobzio/deck` carries a structurally identical pair for
 * its fetch result, so a deck's groups bind straight to the control.
 */
export type FacetItem = {
  value: string;
  label: string;
  count: number;
};

export type FacetGroup<T extends FacetItem = FacetItem> = {
  key: string;
  label: string;
  items: T[];
};

export type FacetsPassthrough<T extends FacetItem = FacetItem> = {
  popover: Passthrough<PopoverProps, PopoverEmits>;
  trigger: Passthrough<FabProps>;
  command: Passthrough<CommandProps<T>, CommandEmits<T>>;
};

export type FacetsProps<T extends FacetItem = FacetItem> = {
  groups: FacetGroup<T>[];
  selected?: Set<string>;
  open?: boolean;
  placeholder?: string;
  pt?: PT<FacetsPassthrough<T>>;
};

export type FacetsEmits = {
  "update:selected": [value: Set<string>];
  "update:open": [value: boolean];
};

export type FacetsContext<T extends FacetItem = FacetItem> = {
  groups: FacetGroup<T>[];
  selected?: Set<string>;
  open: Ref<boolean | undefined>;
  activeCount: number;
  el: ComponentPublicInstance | null;
  settings: FacetsPassthrough<T>;
};

export type FacetsSlots<T extends FacetItem = FacetItem> = {
  trigger?: (props: FacetsContext<T>) => VNode[];
  triggerIcon?: (props: FacetsContext<T>) => VNode[];
  command?: (props: FacetsContext<T>) => VNode[];
};
