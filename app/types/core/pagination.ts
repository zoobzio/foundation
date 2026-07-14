import type { ButtonProps } from "#foundation/types/common/button";
import type { GroupProps } from "#foundation/types/common/group";
import type { SpanProps } from "#foundation/types/common/span";
import type { FabProps } from "#foundation/types/core/fab";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { Recipe } from "#foundation/types/core/recipe";
import type { SelectEmits, SelectProps } from "#foundation/types/core/select";
export type PaginationPassthrough = {
  root?: Passthrough<GroupProps>;
  info?: Passthrough<SpanProps>;
  pages?: Passthrough<GroupProps>;
  first?: Passthrough<FabProps>;
  prev?: Passthrough<FabProps>;
  next?: Passthrough<FabProps>;
  last?: Passthrough<FabProps>;
  numbers?: Passthrough<GroupProps>;
  number?: Passthrough<ButtonProps>;
  pageSize?: Passthrough<SelectProps, SelectEmits>;
};

export type PaginationProps = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  goToPage: (page: number) => void;
  pt?: PaginationPassthrough;
};

export type PaginationEmits = {
  "update:pageSize": [value: number];
};

export type PaginationRecipe = Recipe<PaginationProps, PaginationEmits>;
