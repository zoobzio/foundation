import type { GroupProps } from "#foundation/types/common/group";
import type { FabProps } from "#foundation/types/core/fab";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Deck } from "#foundation/types/data/deck";
import type { DataDeckToolbarPassthrough } from "#foundation/types/data/toolbar";
import type { DataDeckFeedPassthrough } from "#foundation/types/data/deck-feed";

export type DataDeckPassthrough = {
  root?: Passthrough<GroupProps>;
  pendingButton?: Passthrough<FabProps>;

  // Sub-component passthrough
  toolbar?: DataDeckToolbarPassthrough;
  feed?: DataDeckFeedPassthrough;
};

export interface DataDeckProps<T> {
  deck: Deck<T>;
  pt?: DataDeckPassthrough;
}
