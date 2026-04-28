interface FakeRow {
  id: number;
  name: string;
  email: string;
  status: string;
  category: string;
  created: string;
}

const categories = ["Engineering", "Marketing", "Sales", "Support"];

const fakeData: FakeRow[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Inactive" : "Pending",
  category: categories[i % 4]!,
  created: new Date(2024, 0, i + 1).toISOString(),
}));

export const accessFakeTable = createTable<FakeRow, number>("fake", {
  rowKey: "id",
  pinnedColumns: ["id"],
  columns: [
    { key: "id", label: "ID", type: "number", sortable: true },
    { key: "name", label: "Name", type: "text", sortable: true },
    { key: "email", label: "Email", type: "text", sortable: true },
    { key: "status", label: "Status", type: "enum", enumValues: ["Active", "Inactive", "Pending"] },
    { key: "category", label: "Category", type: "enum", enumValues: categories },
    { key: "created", label: "Created", type: "date", sortable: true },
  ],
  actions: [
    {
      icon: "edit",
      label: "Edit",
      action: (row) => console.log("Edit:", row.id),
    },
    {
      icon: "delete",
      label: "Delete",
      action: (row) => console.log("Delete:", row.id),
    },
  ],
  bulkActions: [
    {
      icon: "delete",
      label: "Delete",
      action: (selected) => console.log("Bulk delete:", [...selected]),
    },
    {
      icon: "save",
      label: "Export",
      action: (selected) => console.log("Bulk export:", [...selected]),
    },
  ],
  fetch: async (params) => {
    let result = [...fakeData];

    if (params.query) {
      const q = params.query.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q),
      );
    }

    if (params.facets.size) {
      const byField = new Map<string, string[]>();
      for (const namespaced of params.facets) {
        const sep = namespaced.indexOf(":");
        if (sep === -1) continue;
        const field = namespaced.slice(0, sep);
        const value = namespaced.slice(sep + 1);
        if (!byField.has(field)) byField.set(field, []);
        byField.get(field)!.push(value);
      }
      for (const [field, values] of byField) {
        result = result.filter((r) =>
          values.includes(String(r[field as keyof FakeRow])),
        );
      }
    }

    if (params.dateFilters.length) {
      for (const df of params.dateFilters) {
        const field = df.field as keyof FakeRow;
        result = result.filter((r) => {
          const date = new Date(String(r[field]));
          if (df.operator === "after") return date >= df.value;
          if (df.operator === "before") return date <= df.value;
          if (df.operator === "between" && df.endValue) return date >= df.value && date <= df.endValue;
          return true;
        });
      }
    }

    if (params.sortField) {
      const field = params.sortField as keyof FakeRow;
      result.sort((a, b) => {
        const av = String(a[field]);
        const bv = String(b[field]);
        return params.sortDirection === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      });
    }

    const total = result.length;
    const pageCount = Math.max(1, Math.ceil(total / params.pageSize));
    const start = (params.page - 1) * params.pageSize;
    const data = result.slice(start, start + params.pageSize);

    const facets = [
      {
        key: "status",
        label: "Status",
        items: ["Active", "Inactive", "Pending"].map((s) => ({
          value: s,
          label: s,
          count: result.filter((r) => r.status === s).length,
        })),
      },
      {
        key: "category",
        label: "Category",
        items: categories.map((c) => ({
          value: c,
          label: c,
          count: result.filter((r) => r.category === c).length,
        })),
      },
    ];

    return { data, total, pageCount, facets };
  },
});
