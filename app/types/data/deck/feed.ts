import type { GroupProps } from "#foundation/types/common/group";
import type {
  ScrollerEmits,
  ScrollerProps,
} from "#foundation/types/core/scroller";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { Service } from "#foundation/types/data/deck";
import type { ComponentPublicInstance, VNode } from "vue";

export type DeckFeedPassthrough = {
  root: Passthrough<ScrollerProps, ScrollerEmits>;
  card: Passthrough<GroupProps>;
  sentinel: Passthrough<GroupProps>;
};

export type DeckFeedProps<T> = {
  deck: Service<T>;
  pt?: PT<DeckFeedPassthrough>;
};

export type DeckFeedContext<T> = {
  deck: Service<T>;
  el: ComponentPublicInstance | null;
  settings: DeckFeedPassthrough;
};

export type DeckFeedCardContext<T> = {
  item: T;
  index: number;
  deck: Service<T>;
};

export type DeckFeedSlots<T> = {
  empty?: (props: DeckFeedContext<T>) => VNode[];
  loadingMore?: (props: DeckFeedContext<T>) => VNode[];
  card?: (props: DeckFeedCardContext<T>) => VNode[];
};
