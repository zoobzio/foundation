<script setup lang="ts">
import type { DateFilter } from "@foundation/blocks/types/common";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLoginAt: Date;
}

const columns: DataTableColumn<User>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "createdAt", label: "Created", sortable: true },
  { key: "lastLoginAt", label: "Last Login", sortable: true },
];

const store = useUserTable();

const facetsOpen = ref(false);
const dateFiltersOpen = ref(false);

const isMac = computed(() => {
  if (import.meta.client) {
    return navigator.platform.toUpperCase().includes("MAC");
  }
  return false;
});

const modKey = computed(() => (isMac.value ? "⌘" : "Ctrl"));

// Group active facets by field for display
const activeFacetsByField = computed(() => {
  const grouped: Record<string, { key: string; label: string }[]> = {};
  for (const facetKey of store.selectedFacets.value) {
    const [field, value] = facetKey.split(":");
    if (!grouped[field]) grouped[field] = [];
    grouped[field].push({ key: facetKey, label: value });
  }
  return grouped;
});

const removeFacet = (key: string) => {
  const newSet = new Set(store.selectedFacets.value);
  newSet.delete(key);
  store.selectedFacets.value = newSet;
};

// Group active date filters by field
const activeDateFiltersByField = computed(() => {
  const grouped: Record<string, DateFilter> = {};
  for (const filter of store.dateFilters?.value ?? []) {
    grouped[filter.field] = filter;
  }
  return grouped;
});

// Format date filter for display
const formatDateFilter = (filter: DateFilter) => {
  const formatter = new Intl.DateTimeFormat("en-US", { dateStyle: "short" });
  const date = formatter.format(filter.value);
  switch (filter.operator) {
    case "before":
      return `< ${date}`;
    case "after":
      return `> ${date}`;
    case "between":
      const end = filter.endValue ? formatter.format(filter.endValue) : "?";
      return `${date} - ${end}`;
  }
};

// Format date for cell display
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
};
</script>

<template>
  <DataWidget title="Users">
    <template #actions>
      <Input v-model="store.search.value" placeholder="Search..." shortcut="meta+/">
        <template #prepend>
          <Icon alias="search" />
        </template>
        <template #append>
          <Kbd>{{ modKey }} + /</Kbd>
        </template>
      </Input>
      <DataFacets v-model:open="facetsOpen" :store="store" />
      <DataDateFilters v-model:open="dateFiltersOpen" :store="store" />
      <Fab icon="tag" label="Keywords" />
    </template>

    <div v-if="store.selected.value.size > 0" class="f-widget-selection-bar">
      <span class="f-widget-selection-count">{{ store.selected.value.size }} selected</span>
      <Fab
        v-for="action in store.selectionActions"
        :key="action.label"
        :icon="action.icon"
        :label="action.label"
        @click="action.action(store.selected.value)"
      />
      <Fab icon="close" label="Clear" @click="store.clearSelection" />
    </div>

    <DataTable :store="store" :columns="columns" selectable row-key="id">
      <template #header="{ column, sort }">
        <button
          v-if="column.sortable"
          type="button"
          class="f-data-table-header-btn"
          @click="sort"
        >
          {{ column.label }}
          <Icon
            v-if="store.sortKey.value === column.key"
            :alias="store.sortDirection.value === 'asc' ? 'chevron-up' : 'chevron-down'"
            class="f-data-table-sort-icon"
          />
        </button>
        <span v-else class="f-data-table-header">{{ column.label }}</span>
        <template v-if="activeFacetsByField[column.key]">
          <Chip
            v-for="facet in activeFacetsByField[column.key]"
            :key="facet.key"
            closable
            @close="removeFacet(facet.key)"
          >
            {{ facet.label }}
          </Chip>
        </template>
        <Chip
          v-if="activeDateFiltersByField[column.key]"
          closable
          @close="store.removeDateFilter(column.key)"
        >
          {{ formatDateFilter(activeDateFiltersByField[column.key]) }}
        </Chip>
      </template>
      <template #cell="{ column, value }">
        <Chip v-if="column.key === 'status'" :variant="value === 'Active' ? 'primary' : value === 'Pending' ? 'secondary' : 'outline'">
          {{ value }}
        </Chip>
        <template v-else-if="column.key === 'createdAt' || column.key === 'lastLoginAt'">
          {{ formatDate(value as Date) }}
        </template>
        <template v-else>{{ value }}</template>
      </template>
    </DataTable>
  </DataWidget>
</template>
