import type {
  BrowserCrumb,
  BrowserFolder,
  State,
} from "../types/data/browser";
import type { SortDirection } from "../types/data/table";

import { useState } from "#imports";
import { BROWSER_DEFAULT_SORT_DIRECTION } from "../constants/browser";

/**
 * No config parameter, unlike the other stores — browser defaults derive
 * from nothing: the trail starts at the root and sorting starts unset.
 */
export const accessBrowser = <T>(id: string): State<T> => {
  const folders = useState<BrowserFolder[]>(
    `browser-${id}-folders`,
    () => [],
  );
  const files = useState<T[]>(`browser-${id}-files`, () => []);
  const loading = useState<boolean>(`browser-${id}-loading`, () => false);
  const initialized = useState<boolean>(
    `browser-${id}-initialized`,
    () => false,
  );
  const path = useState<BrowserCrumb[]>(`browser-${id}-path`, () => []);
  const sortField = useState<string | null>(
    `browser-${id}-sortField`,
    () => null,
  );
  const sortDirection = useState<SortDirection>(
    `browser-${id}-sortDirection`,
    () => BROWSER_DEFAULT_SORT_DIRECTION,
  );
  const selected = useState<Set<string>>(
    `browser-${id}-selected`,
    () => new Set(),
  );

  return {
    folders,
    files,
    loading,
    initialized,
    path,
    sortField,
    sortDirection,
    selected,
  };
};
