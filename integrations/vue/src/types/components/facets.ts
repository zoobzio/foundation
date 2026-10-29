import type { CommandProps, CommandEmits } from "./command";
import type { FabProps } from "./fab";
import type { PopoverProps, PopoverEmits } from "./popover";
import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * A facet value with its result count.
 */
export interface FacetItem {
  value: string;
  label: string;
  count: number;
}

/**
 * A labeled group of facet items.
 */
export type FacetGroup<T extends FacetItem = FacetItem> = {
  key: string;
  label: string;
  items: T[];
};

/**
 * The parts of the facets that accept passthrough.
 */
export type FacetsPassthrough<T extends FacetItem = FacetItem> = {
  popover: Passthrough<PopoverProps, PopoverEmits>;
  trigger: Passthrough<FabProps>;
  command: Passthrough<CommandProps<T>, CommandEmits<T>>;
};

/**
 * Props of the facets. `selected` holds the selected facet values.
 */
export type FacetsProps<T extends FacetItem = FacetItem> = {
  groups: FacetGroup<T>[];
  selected?: Set<string>;
  open?: boolean;
  placeholder?: string;
  pt?: PT<FacetsPassthrough<T>>;
};

/**
 * Emits of the facets.
 */
export type FacetsEmits = {
  "update:selected": [value: Set<string>];
  "update:open": [value: boolean];
};

/**
 * The facets view model, served to `defineExpose` and the slots. `activeCount`
 * is the number of selected values.
 */
export type FacetsContext<T extends FacetItem = FacetItem> = {
  groups: FacetGroup<T>[];
  selected?: Set<string>;
  open: Ref<boolean>;
  activeCount: number;
  el: ComponentPublicInstance | null;
  settings: FacetsPassthrough<T>;
};

/**
 * Slots of the facets. Each slot receives the context.
 */
export type FacetsSlots<T extends FacetItem = FacetItem> = {
  trigger?: (props: FacetsContext<T>) => VNode[];
  triggerIcon?: (props: FacetsContext<T>) => VNode[];
  command?: (props: FacetsContext<T>) => VNode[];
};

/**
 * A facets instance as data: props plus emit listeners.
 */
export type FacetsDefinition<T extends FacetItem = FacetItem> = Definition<
  FacetsProps<T>,
  FacetsEmits
>;
