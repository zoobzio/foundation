interface MockRow {
  id: number;
  name: string;
  email: string;
  status: string;
  created: string;
}

const mockData: MockRow[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? "active" : i % 3 === 1 ? "inactive" : "pending",
  created: new Date(2024, 0, i + 1).toISOString(),
}));

export const accessMockTableStore = createTableStore<MockRow, number>("mock", {
  rowKey: "id",
  columns: [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "status", label: "Status" },
    { key: "created", label: "Created", sortable: true },
  ],
  defaultPageSize: 10,
  fetch: async (params) => {
    let result = [...mockData];

    if (params.query) {
      const q = params.query.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q),
      );
    }

    if (params.sortField) {
      const field = params.sortField as keyof MockRow;
      result.sort((a, b) => {
        const av = String(a[field]);
        const bv = String(b[field]);
        return params.sortDirection === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      });
    }

    const total = result.length;
    const start = (params.page - 1) * params.pageSize;
    const data = result.slice(start, start + params.pageSize);

    return { data, total };
  },
  facetGroups: (data) => [
    {
      key: "status",
      label: "Status",
      items: ["active", "inactive", "pending"].map((s) => ({
        value: s,
        label: s.charAt(0).toUpperCase() + s.slice(1),
        count: data.filter((r) => r.status === s).length,
      })),
    },
  ],
  dateFields: [{ key: "created", label: "Created" }],
  selectionActions: [
    {
      icon: "delete",
      label: "Delete selected",
      action: (selected) => console.log("Delete:", [...selected]),
    },
  ],
});
