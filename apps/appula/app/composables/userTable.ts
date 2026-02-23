import type { TableStore, SelectableStore, FacetableStore, DateFilterableStore } from "@foundation/blocks/types/common";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export function useUserTable(): TableStore<User> & SelectableStore<number> & FacetableStore & DateFilterableStore {
  const store = useUsersStore();
  return {
    ...storeToRefs(store),
    sort: store.sort,
    goToPage: store.goToPage,
    setFilter: store.setFilter,
    clearFilters: store.clearFilters,
    selectionActions: store.selectionActions,
    toggleRow: store.toggleRow,
    toggleAll: store.toggleAll,
    clearSelection: store.clearSelection,
    dateFields: store.dateFields,
    addDateFilter: store.addDateFilter,
    removeDateFilter: store.removeDateFilter,
    clearDateFilters: store.clearDateFilters,
  };
}
