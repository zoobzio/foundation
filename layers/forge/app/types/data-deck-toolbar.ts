import type { Deck } from "./data-deck";

export type DataDeckToolbarPassthrough = {
  root?: Passthrough<GroupProps>;
  title?: Passthrough<GroupProps>;
  actions?: Passthrough<GroupProps>;
};

export interface DataDeckToolbarProps<T> {
  deck: Deck<T>;
  pt?: DataDeckToolbarPassthrough;
}
