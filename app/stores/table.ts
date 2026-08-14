import type { Config, SortDirection, State } from "../types/data/table";

import { useState } from "#imports";
import {
  TABLE_DEFAULT_PAGE_SIZE,
  TABLE_DEFAULT_SORT_DIRECTION,
} from "../constants/table";

export const accessTable = <T, K>(
  id: string,
  config: Config<T, K>,
): State<T, K> => {
  const defaultColumnKeys = (
    config.defaultColumnOrder ?? config.columns.map((c) => c.key)
  ).map(String);

  const data = useState<T[]>(`table-${id}-data`, () => []);
  const loading = useState<boolean>(`table-${id}-loading`, () => false);
  const initialized = useState<boolean>(
    `table-${id}-initialized`,
    () => false,
  );
  const page = useState<number>(`table-${id}-page`, () => 1);
  const pageSize = useState<number>(
    `table-${id}-pageSize`,
    () => TABLE_DEFAULT_PAGE_SIZE,
  );
  const total = useState<number>(`table-${id}-total`, () => 0);
  const pageCount = useState<number>(`table-${id}-pageCount`, () => 0);
  const sortField = useState<string | null>(
    `table-${id}-sortField`,
    () => null,
  );
  const sortDirection = useState<SortDirection>(
    `table-${id}-sortDirection`,
    () => TABLE_DEFAULT_SORT_DIRECTION,
  );
  const selected = useState<Set<K>>(`table-${id}-selected`, () => new Set());
  const columnOrder = useState<string[]>(
    `table-${id}-columnOrder`,
    () => defaultColumnKeys,
  );

  return {
    data,
    loading,
    initialized,
    page,
    pageSize,
    total,
    pageCount,
    sortField,
    sortDirection,
    selected,
    columnOrder,
  };
};
