import type { AnchorProps } from "#foundation/types/common/anchor";
import type { ImgProps } from "#foundation/types/common/img";
import type { SpanProps } from "#foundation/types/common/span";
import type { TbodyProps } from "#foundation/types/common/tbody";
import type { TdProps } from "#foundation/types/common/td";
import type { TrProps } from "#foundation/types/common/tr";
import type { CheckboxEmits, CheckboxProps } from "#foundation/types/core/checkbox";
import type { FabProps } from "#foundation/types/core/fab";
import type { MenuEmits, MenuProps } from "#foundation/types/core/menu";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Table } from "#foundation/types/data/table";

export type DataTableBodyPassthrough = {
  tbody?: Passthrough<TbodyProps>;
  tr?: Passthrough<TrProps>;
  td?: Passthrough<TdProps>;
  empty?: Passthrough<TdProps>;
  rowCheckbox?: Passthrough<CheckboxProps, CheckboxEmits>;
  cellAnchor?: Passthrough<AnchorProps>;
  cellImg?: Passthrough<ImgProps>;
  cellSpan?: Passthrough<SpanProps>;
  actionsMenu?: Passthrough<MenuProps, MenuEmits>;
  actionsTrigger?: Passthrough<FabProps>;
};

export type DataTableBodyProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTableBodyPassthrough;
};
