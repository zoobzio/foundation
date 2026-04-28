import type { Deck } from "./data-deck";
import type { DataDeckToolbarPassthrough } from "./data-deck-toolbar";
import type { DataDeckFeedPassthrough } from "./data-deck-feed";

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
