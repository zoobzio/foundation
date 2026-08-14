import type {
  CommandOption,
  CommandProps,
  CommandEmits,
} from "./command";
import type { FabProps } from "./fab";
import type { PopoverProps, PopoverEmits } from "./popover";
import type { ComponentEvents } from "../events";
import type { Passthrough, PT } from "../passthrough";
import type { ComponentPublicInstance, Ref, VNode } from "vue";

/**
 * A single facet value with its result count. Canonical home for the facet
 * shapes — the data machines (table, deck) import these from here.
 */
export type FacetItem = {
  value: string;
  label: string;
  count: number;
};

export type FacetGroup = {
  key: string;
  label: string;
  items: FacetItem[];
};

export type FacetsPassthrough = {
  popover: Passthrough<PopoverProps, PopoverEmits>;
  trigger: Passthrough<FabProps>;
  command: Passthrough<CommandProps<CommandOption>, CommandEmits<CommandOption>>;
};

export type FacetsProps = {
  groups: FacetGroup[];
  selected?: Set<string>;
  open?: boolean;
  placeholder?: string;
  pt?: PT<FacetsPassthrough>;
};

export type FacetsEmits = ComponentEvents["facets"] & {
  "update:selected": [value: Set<string>];
  "update:open": [value: boolean];
};

export type FacetsContext = {
  groups: FacetGroup[];
  selected?: Set<string>;
  open: Ref<boolean | undefined>;
  activeCount: number;
  el: ComponentPublicInstance | null;
  settings: FacetsPassthrough;
};

export type FacetsSlots = {
  trigger?: (props: FacetsContext) => VNode[];
  command?: (props: FacetsContext) => VNode[];
};
