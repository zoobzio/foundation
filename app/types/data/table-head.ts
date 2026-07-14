import type { ButtonProps } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { IconProps } from "#foundation/types/common/icon";
import type { SpanProps } from "#foundation/types/common/span";
import type { ThProps } from "#foundation/types/common/th";
import type { TheadProps } from "#foundation/types/common/thead";
import type { TrProps } from "#foundation/types/common/tr";
import type { CheckboxEmits, CheckboxProps } from "#foundation/types/core/checkbox";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Table } from "#foundation/types/data/table";

export type DataTableHeadPassthrough = {
  thead?: Passthrough<TheadProps>;
  theadTr?: Passthrough<TrProps>;
  th?: Passthrough<ThProps>;
  selectAllCheckbox?: Passthrough<CheckboxProps, CheckboxEmits>;
  headerWrap?: Passthrough<GroupProps>;
  sortButton?: Passthrough<ButtonProps>;
  sortIcon?: Passthrough<IconProps>;
  headerLabel?: Passthrough<SpanProps>;
  dragIcon?: Passthrough<IconProps>;
};

export type DataTableHeadProps<T, K = unknown> = {
  table: Table<T, K>;
  pt?: DataTableHeadPassthrough;
};
