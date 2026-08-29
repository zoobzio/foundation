import type { FabProps, FabEmits } from "../../core/fab";
import type { FacetsProps, FacetsEmits } from "../../core/facets";
import type { MenuProps, MenuEmits } from "../../core/menu";
import type { PopoverProps, PopoverEmits } from "../../core/popover";
import type { Passthrough, PT } from "../../passthrough";
import type { Service } from "../deck";
import type { VNode } from "vue";

export type DeckToolbarPassthrough = {
  sortMenu: Passthrough<MenuProps, MenuEmits>;
  searchPopover: Passthrough<PopoverProps, PopoverEmits>;
  searchTrigger: Passthrough<FabProps>;
  facets: Passthrough<FacetsProps, FacetsEmits>;
  refresh: Passthrough<FabProps, FabEmits>;
};

export type DeckToolbarProps<T> = {
  deck: Service<T>;
  pt?: PT<DeckToolbarPassthrough>;
};

export type DeckToolbarContext<T> = {
  deck: Service<T>;
  el: HTMLDivElement | null;
  settings: DeckToolbarPassthrough;
};

export type DeckToolbarSlots<T> = {
  title?: (props: DeckToolbarContext<T>) => VNode[];
  actions?: (props: DeckToolbarContext<T>) => VNode[];
};
