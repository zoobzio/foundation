import { defineStore } from "pinia";
import type { DateFilter, DateFieldConfig } from "@foundation/blocks/types/common";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLoginAt: Date;
}

// Generate sample dates
const d = (year: number, month: number, day: number) => new Date(year, month - 1, day);

const users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", createdAt: d(2023, 1, 15), lastLoginAt: d(2025, 2, 10) },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", status: "Active", createdAt: d(2023, 2, 20), lastLoginAt: d(2025, 2, 12) },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User", status: "Inactive", createdAt: d(2023, 3, 5), lastLoginAt: d(2024, 6, 15) },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Moderator", status: "Active", createdAt: d(2023, 3, 18), lastLoginAt: d(2025, 2, 11) },
  { id: 5, name: "Edward Norton", email: "edward@example.com", role: "User", status: "Pending", createdAt: d(2025, 1, 28), lastLoginAt: d(2025, 1, 28) },
  { id: 6, name: "Fiona Green", email: "fiona@example.com", role: "Admin", status: "Active", createdAt: d(2022, 11, 10), lastLoginAt: d(2025, 2, 13) },
  { id: 7, name: "George Wilson", email: "george@example.com", role: "User", status: "Inactive", createdAt: d(2023, 5, 22), lastLoginAt: d(2024, 3, 20) },
  { id: 8, name: "Hannah Lee", email: "hannah@example.com", role: "Moderator", status: "Active", createdAt: d(2023, 6, 14), lastLoginAt: d(2025, 2, 9) },
  { id: 9, name: "Ivan Petrov", email: "ivan@example.com", role: "User", status: "Active", createdAt: d(2023, 7, 3), lastLoginAt: d(2025, 2, 8) },
  { id: 10, name: "Julia Chen", email: "julia@example.com", role: "Admin", status: "Active", createdAt: d(2022, 8, 25), lastLoginAt: d(2025, 2, 13) },
  { id: 11, name: "Kevin Park", email: "kevin@example.com", role: "User", status: "Pending", createdAt: d(2025, 2, 1), lastLoginAt: d(2025, 2, 1) },
  { id: 12, name: "Laura Martinez", email: "laura@example.com", role: "Moderator", status: "Active", createdAt: d(2023, 9, 12), lastLoginAt: d(2025, 2, 7) },
  { id: 13, name: "Michael Davis", email: "michael@example.com", role: "User", status: "Active", createdAt: d(2023, 10, 5), lastLoginAt: d(2025, 1, 30) },
  { id: 14, name: "Nina Patel", email: "nina@example.com", role: "User", status: "Inactive", createdAt: d(2023, 10, 28), lastLoginAt: d(2024, 8, 5) },
  { id: 15, name: "Oscar Rivera", email: "oscar@example.com", role: "Admin", status: "Active", createdAt: d(2022, 5, 17), lastLoginAt: d(2025, 2, 12) },
  { id: 16, name: "Paula White", email: "paula@example.com", role: "User", status: "Active", createdAt: d(2023, 11, 8), lastLoginAt: d(2025, 2, 6) },
  { id: 17, name: "Quinn Foster", email: "quinn@example.com", role: "Moderator", status: "Pending", createdAt: d(2025, 1, 15), lastLoginAt: d(2025, 1, 15) },
  { id: 18, name: "Rachel Kim", email: "rachel@example.com", role: "User", status: "Active", createdAt: d(2023, 12, 1), lastLoginAt: d(2025, 2, 4) },
  { id: 19, name: "Samuel Wright", email: "samuel@example.com", role: "User", status: "Inactive", createdAt: d(2024, 1, 10), lastLoginAt: d(2024, 9, 18) },
  { id: 20, name: "Tina Brooks", email: "tina@example.com", role: "Admin", status: "Active", createdAt: d(2022, 3, 22), lastLoginAt: d(2025, 2, 13) },
  { id: 21, name: "Ulysses Grant", email: "ulysses@example.com", role: "User", status: "Active", createdAt: d(2024, 2, 14), lastLoginAt: d(2025, 2, 3) },
  { id: 22, name: "Victoria Hall", email: "victoria@example.com", role: "Moderator", status: "Active", createdAt: d(2024, 3, 5), lastLoginAt: d(2025, 2, 10) },
  { id: 23, name: "William Turner", email: "william@example.com", role: "User", status: "Pending", createdAt: d(2025, 2, 5), lastLoginAt: d(2025, 2, 5) },
  { id: 24, name: "Xena Lopez", email: "xena@example.com", role: "User", status: "Active", createdAt: d(2024, 4, 18), lastLoginAt: d(2025, 1, 28) },
  { id: 25, name: "Yusuf Ahmed", email: "yusuf@example.com", role: "Admin", status: "Active", createdAt: d(2022, 7, 9), lastLoginAt: d(2025, 2, 11) },
  { id: 26, name: "Zoe Campbell", email: "zoe@example.com", role: "User", status: "Inactive", createdAt: d(2024, 5, 2), lastLoginAt: d(2024, 10, 25) },
  { id: 27, name: "Aaron Hughes", email: "aaron@example.com", role: "User", status: "Active", createdAt: d(2024, 5, 20), lastLoginAt: d(2025, 2, 9) },
  { id: 28, name: "Bella Scott", email: "bella@example.com", role: "Moderator", status: "Active", createdAt: d(2024, 6, 8), lastLoginAt: d(2025, 2, 8) },
  { id: 29, name: "Carlos Diaz", email: "carlos@example.com", role: "User", status: "Pending", createdAt: d(2025, 1, 20), lastLoginAt: d(2025, 1, 20) },
  { id: 30, name: "Daisy Morgan", email: "daisy@example.com", role: "User", status: "Active", createdAt: d(2024, 7, 1), lastLoginAt: d(2025, 2, 2) },
  { id: 31, name: "Ethan Reed", email: "ethan@example.com", role: "Admin", status: "Active", createdAt: d(2022, 9, 15), lastLoginAt: d(2025, 2, 13) },
  { id: 32, name: "Faith Cooper", email: "faith@example.com", role: "User", status: "Inactive", createdAt: d(2024, 7, 22), lastLoginAt: d(2024, 11, 10) },
  { id: 33, name: "Gabriel Torres", email: "gabriel@example.com", role: "User", status: "Active", createdAt: d(2024, 8, 5), lastLoginAt: d(2025, 1, 25) },
  { id: 34, name: "Holly Bennett", email: "holly@example.com", role: "Moderator", status: "Active", createdAt: d(2024, 8, 18), lastLoginAt: d(2025, 2, 7) },
  { id: 35, name: "Isaac Murphy", email: "isaac@example.com", role: "User", status: "Active", createdAt: d(2024, 9, 1), lastLoginAt: d(2025, 2, 5) },
  { id: 36, name: "Jasmine Cox", email: "jasmine@example.com", role: "User", status: "Pending", createdAt: d(2025, 2, 8), lastLoginAt: d(2025, 2, 8) },
  { id: 37, name: "Kyle Richardson", email: "kyle@example.com", role: "Admin", status: "Active", createdAt: d(2022, 12, 1), lastLoginAt: d(2025, 2, 12) },
  { id: 38, name: "Lily Sanders", email: "lily@example.com", role: "User", status: "Active", createdAt: d(2024, 9, 20), lastLoginAt: d(2025, 1, 31) },
  { id: 39, name: "Mason Price", email: "mason@example.com", role: "User", status: "Inactive", createdAt: d(2024, 10, 5), lastLoginAt: d(2024, 12, 20) },
  { id: 40, name: "Nora Butler", email: "nora@example.com", role: "Moderator", status: "Active", createdAt: d(2024, 10, 15), lastLoginAt: d(2025, 2, 6) },
  { id: 41, name: "Owen Gray", email: "owen@example.com", role: "User", status: "Active", createdAt: d(2024, 11, 1), lastLoginAt: d(2025, 2, 4) },
  { id: 42, name: "Paige Russell", email: "paige@example.com", role: "User", status: "Active", createdAt: d(2024, 11, 12), lastLoginAt: d(2025, 2, 3) },
  { id: 43, name: "Quentin Hayes", email: "quentin@example.com", role: "Admin", status: "Pending", createdAt: d(2025, 1, 10), lastLoginAt: d(2025, 1, 10) },
  { id: 44, name: "Ruby Coleman", email: "ruby@example.com", role: "User", status: "Active", createdAt: d(2024, 11, 25), lastLoginAt: d(2025, 2, 1) },
  { id: 45, name: "Sean Patterson", email: "sean@example.com", role: "User", status: "Inactive", createdAt: d(2024, 12, 5), lastLoginAt: d(2025, 1, 5) },
  { id: 46, name: "Tara Jenkins", email: "tara@example.com", role: "Moderator", status: "Active", createdAt: d(2024, 12, 15), lastLoginAt: d(2025, 2, 10) },
  { id: 47, name: "Uma Sharma", email: "uma@example.com", role: "User", status: "Active", createdAt: d(2024, 12, 22), lastLoginAt: d(2025, 2, 9) },
  { id: 48, name: "Victor Long", email: "victor@example.com", role: "User", status: "Pending", createdAt: d(2025, 1, 5), lastLoginAt: d(2025, 1, 5) },
  { id: 49, name: "Wendy James", email: "wendy@example.com", role: "Admin", status: "Active", createdAt: d(2022, 6, 18), lastLoginAt: d(2025, 2, 13) },
  { id: 50, name: "Xavier Bell", email: "xavier@example.com", role: "User", status: "Active", createdAt: d(2025, 1, 2), lastLoginAt: d(2025, 2, 11) },
];

export const useUsersStore = defineStore("users", () => {
  // Source data
  const items = ref(users);

  // Sorting
  const sortKey = ref<keyof User | null>("name");
  const sortDirection = ref<SortDirection>("asc");

  const sort = (key: keyof User) => {
    if (sortKey.value === key) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    } else {
      sortKey.value = key;
      sortDirection.value = "asc";
    }
  };

  // Search & Filtering
  const search = ref("");
  const filters = ref<Record<string, unknown>>({});

  const setFilter = (key: string, value: unknown) => {
    filters.value = { ...filters.value, [key]: value };
  };

  const clearFilters = () => {
    filters.value = {};
    search.value = "";
  };

  // Processed data (filtered & sorted)
  const processedData = computed(() => {
    let result = [...items.value];

    if (search.value) {
      const query = search.value.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(query),
        ),
      );
    }

    for (const [key, value] of Object.entries(filters.value)) {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          result = result.filter((item) => value.includes(item[key as keyof User]));
        } else {
          result = result.filter((item) => item[key as keyof User] === value);
        }
      }
    }

    // Apply date filters
    for (const filter of dateFilters.value) {
      const { field, operator, value, endValue } = filter;
      result = result.filter((item) => {
        const itemDate = item[field as keyof User];
        if (!(itemDate instanceof Date)) return true;

        const itemTime = itemDate.getTime();
        const filterTime = value.getTime();

        switch (operator) {
          case "before":
            return itemTime < filterTime;
          case "after":
            return itemTime > filterTime;
          case "between":
            if (!endValue) return true;
            const endTime = endValue.getTime();
            return itemTime >= filterTime && itemTime <= endTime;
          default:
            return true;
        }
      });
    }

    if (sortKey.value) {
      const key = sortKey.value;
      const dir = sortDirection.value === "asc" ? 1 : -1;
      result.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return -1 * dir;
        if (aVal > bVal) return 1 * dir;
        return 0;
      });
    }

    return result;
  });

  // Pagination
  const page = ref(1);
  const pageSize = ref(5);
  const total = computed(() => processedData.value.length);
  const pageCount = computed(
    () => Math.ceil(total.value / pageSize.value) || 1,
  );

  const goToPage = (p: number) => {
    page.value = Math.max(1, Math.min(p, pageCount.value));
  };

  // Reset page when filters change
  watch([search, filters], () => {
    page.value = 1;
  });

  // Adjust page if it exceeds new page count after pageSize change
  watch(pageSize, () => {
    if (page.value > pageCount.value) {
      page.value = pageCount.value || 1;
    }
  });

  // Paginated data
  const data = computed(() => {
    const start = (page.value - 1) * pageSize.value;
    return processedData.value.slice(start, start + pageSize.value);
  });

  const loading = ref(false);

  // Facets
  const facetFields: (keyof User)[] = ["role", "status"];
  const selectedFacets = ref<Set<string>>(new Set());

  // Compute facets with counts from current filtered data
  const facets = computed(() => {
    return facetFields.map((field) => {
      // Count from processedData (fully filtered)
      const counts = new Map<string, number>();
      for (const item of processedData.value) {
        const val = String(item[field]);
        counts.set(val, (counts.get(val) || 0) + 1);
      }

      // Get all possible values from source data
      const allValues = new Set<string>();
      for (const item of items.value) {
        allValues.add(String(item[field]));
      }

      return {
        key: field,
        label: field.charAt(0).toUpperCase() + field.slice(1),
        items: [...allValues].sort().map((val) => ({
          value: `${field}:${val}`,
          label: val,
          count: counts.get(val) || 0,
        })),
      };
    });
  });

  // Sync selectedFacets to filters
  watch(selectedFacets, (sel) => {
    const facetFilters: Record<string, Set<string>> = {};
    for (const key of sel) {
      const [field, value] = key.split(":");
      if (!facetFilters[field]) {
        facetFilters[field] = new Set();
      }
      facetFilters[field].add(value);
    }

    for (const field of facetFields) {
      const values = facetFilters[field];
      if (values && values.size > 0) {
        setFilter(field, [...values]);
      } else {
        setFilter(field, undefined);
      }
    }
  }, { deep: true });

  // Date Filters
  const dateFields: DateFieldConfig[] = [
    { key: "createdAt", label: "Created" },
    { key: "lastLoginAt", label: "Last Login" },
  ];

  const dateFilters = ref<DateFilter[]>([]);

  const addDateFilter = (filter: DateFilter) => {
    const existing = dateFilters.value.findIndex((f) => f.field === filter.field);
    if (existing >= 0) {
      dateFilters.value.splice(existing, 1, filter);
    } else {
      dateFilters.value.push(filter);
    }
  };

  const removeDateFilter = (field: string) => {
    dateFilters.value = dateFilters.value.filter((f) => f.field !== field);
  };

  const clearDateFilters = () => {
    dateFilters.value = [];
  };

  // Reset page when date filters change
  watch(dateFilters, () => {
    page.value = 1;
  }, { deep: true });

  // Selection
  const selected = ref(new Set<number>());

  const isAllSelected = computed(() => {
    if (data.value.length === 0) return false;
    return data.value.every((row) => selected.value.has(row.id));
  });

  const isIndeterminate = computed(() => {
    if (data.value.length === 0) return false;
    const selectedCount = data.value.filter((row) => selected.value.has(row.id)).length;
    return selectedCount > 0 && selectedCount < data.value.length;
  });

  const toggleRow = (id: number) => {
    const newSelected = new Set(selected.value);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    selected.value = newSelected;
  };

  const toggleAll = () => {
    if (isAllSelected.value) {
      // Deselect all on current page
      const newSelected = new Set(selected.value);
      for (const row of data.value) {
        newSelected.delete(row.id);
      }
      selected.value = newSelected;
    } else {
      // Select all on current page
      const newSelected = new Set(selected.value);
      for (const row of data.value) {
        newSelected.add(row.id);
      }
      selected.value = newSelected;
    }
  };

  const clearSelection = () => {
    selected.value = new Set();
  };

  const selectionActions = [
    {
      icon: "edit" as const,
      label: "Edit",
      action: (sel: Set<number>) => {
        console.log("Edit", [...sel]);
      },
    },
    {
      icon: "delete" as const,
      label: "Delete",
      action: (sel: Set<number>) => {
        console.log("Delete", [...sel]);
      },
    },
  ];

  return {
    data,
    total,
    loading,
    sortKey,
    sortDirection,
    sort,
    page,
    pageSize,
    pageCount,
    goToPage,
    search,
    filters,
    setFilter,
    clearFilters,
    facets,
    selectedFacets,
    dateFields,
    dateFilters,
    addDateFilter,
    removeDateFilter,
    clearDateFilters,
    selected,
    isAllSelected,
    isIndeterminate,
    selectionActions,
    toggleRow,
    toggleAll,
    clearSelection,
  };
});
