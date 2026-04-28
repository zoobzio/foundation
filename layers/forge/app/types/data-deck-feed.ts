import type { Deck } from "./data-deck";

export type DataDeckFeedPassthrough = {
  root?: Passthrough<ScrollerProps, ScrollerEmits>;
  card?: Passthrough<GroupProps>;
  sentinel?: Passthrough<GroupProps>;
};

export interface DataDeckFeedProps<T> {
  deck: Deck<T>;
  pt?: DataDeckFeedPassthrough;
}
