import type { GroupProps } from "#foundation/types/common/group";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Deck } from "#foundation/types/data/deck";

export type DataDeckToolbarPassthrough = {
  root?: Passthrough<GroupProps>;
  title?: Passthrough<GroupProps>;
  actions?: Passthrough<GroupProps>;
};

export interface DataDeckToolbarProps<T> {
  deck: Deck<T>;
  pt?: DataDeckToolbarPassthrough;
}
