interface FakeRow {
  id: number;
  name: string;
  email: string;
  status: string;
  created: string;
}

const fakeData: FakeRow[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? "active" : i % 3 === 1 ? "inactive" : "pending",
  created: new Date(2024, 0, i + 1).toISOString(),
}));

export const accessFakeTable = createTable<FakeRow, number>("fake", {
  rowKey: "id",
  columns: [
    { key: "id", label: "ID", type: "number", sortable: true },
    { key: "name", label: "Name", type: "text", sortable: true },
    { key: "email", label: "Email", type: "text", sortable: true },
    { key: "status", label: "Status", type: "enum" },
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
        items: ["active", "inactive", "pending"].map((s) => ({
          value: s,
          label: s.charAt(0).toUpperCase() + s.slice(1),
          count: result.filter((r) => r.status === s).length,
        })),
      },
    ];

    return { data, total, pageCount, facets };
  },
});
