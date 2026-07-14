import type { GroupProps } from "#foundation/types/common/group";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { ScrollerEmits, ScrollerProps } from "#foundation/types/core/scroller";
import type { Deck } from "#foundation/types/data/deck";

export type DataDeckFeedPassthrough = {
  root?: Passthrough<ScrollerProps, ScrollerEmits>;
  card?: Passthrough<GroupProps>;
  sentinel?: Passthrough<GroupProps>;
};

export interface DataDeckFeedProps<T> {
  deck: Deck<T>;
  pt?: DataDeckFeedPassthrough;
}
