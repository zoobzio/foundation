import type { ButtonProps, ButtonEmits } from "../../common/button";
import type { GroupProps } from "../../common/group";
import type { IconProps } from "../../common/icon";
import type { InputProps, InputEmits } from "../../common/input";
import type { FabProps, FabEmits } from "../../core/fab";
import type { FacetsProps, FacetsEmits } from "../../core/facets";
import type { MenuProps, MenuEmits } from "../../core/menu";
import type { PopoverProps, PopoverEmits } from "../../core/popover";
import type { Passthrough, PT } from "../../passthrough";
import type { Service } from "../deck";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * The `search` entry widens the common input's contract with the native
 * bindings the toolbar drives (`value`, `keydown`); they fall through the
 * component to its root element.
 */
export type DeckToolbarPassthrough = {
  root: Passthrough<GroupProps>;
  title: Passthrough<GroupProps>;
  sortMenu: Passthrough<MenuProps, MenuEmits>;
  sortTrigger: Passthrough<ButtonProps, ButtonEmits>;
  sortChevron: Passthrough<IconProps>;
  actions: Passthrough<GroupProps>;
  searchPopover: Passthrough<PopoverProps, PopoverEmits>;
  searchTrigger: Passthrough<FabProps>;
  search: Passthrough<
    InputProps & { value?: string },
    InputEmits & { keydown: [event: KeyboardEvent] }
  >;
  facets: Passthrough<FacetsProps, FacetsEmits>;
  refresh: Passthrough<FabProps, FabEmits>;
};

export type DeckToolbarProps<T> = {
  deck: Service<T>;
  pt?: PT<DeckToolbarPassthrough>;
};

export type DeckToolbarContext<T> = {
  deck: Service<T>;
  el: ComponentPublicInstance | null;
  settings: DeckToolbarPassthrough;
};

export type DeckToolbarSlots<T> = {
  title?: (props: DeckToolbarContext<T>) => VNode[];
  actions?: (props: DeckToolbarContext<T>) => VNode[];
};
