import type { ButtonProps, ButtonEmits } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { InputProps, InputEmits } from "#foundation/types/common/input";
import type { FabProps, FabEmits } from "#foundation/types/core/fab";
import type { FacetsProps, FacetsEmits } from "#foundation/types/core/facets";
import type { MenuProps, MenuEmits } from "#foundation/types/core/menu";
import type { PopoverProps, PopoverEmits } from "#foundation/types/core/popover";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { Deck } from "#foundation/types/data/deck";
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
  deck: Deck<T>;
  pt?: PT<DeckToolbarPassthrough>;
};

export type DeckToolbarContext<T> = {
  deck: Deck<T>;
  el: ComponentPublicInstance | null;
  settings: DeckToolbarPassthrough;
};

export type DeckToolbarSlots<T> = {
  title?: (props: DeckToolbarContext<T>) => VNode[];
  actions?: (props: DeckToolbarContext<T>) => VNode[];
};
