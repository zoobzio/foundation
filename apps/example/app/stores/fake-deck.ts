interface FakeItem {
  id: number;
  title: string;
  status: string;
  category: string;
  created: string;
  updated: string;
}

const categories = ["Engineering", "Marketing", "Sales", "Support"];
const statuses = ["Active", "Inactive", "Pending"];

const generateItems = (prefix: string, count: number): FakeItem[] =>
  Array.from({ length: count }, (_, i) => {
    const created = new Date(2025, 2, 1, 0, 0, 0);
    created.setMinutes(created.getMinutes() - i * 15);
    const updated = new Date(created);
    updated.setHours(updated.getHours() + Math.floor(Math.random() * 24));
    return {
      id: i + 1,
      title: `${prefix} ${i + 1}`,
      status: statuses[i % 3]!,
      category: categories[i % 4]!,
      created: created.toISOString(),
      updated: updated.toISOString(),
    };
  });

const docData = generateItems("Document", 200);
const noteData = generateItems("Note", 100);

const fakeFetch = (data: FakeItem[]) => async (params: DataDeckFetchParams): Promise<DataDeckFetchResult<FakeItem>> => {
  let result = [...data];

  result.sort((a, b) => {
    const aDate = a[params.sortField as keyof FakeItem] as string;
    const bDate = b[params.sortField as keyof FakeItem] as string;
    return bDate.localeCompare(aDate);
  });

  if (params.query) {
    const q = params.query.toLowerCase();
    result = result.filter((r) => r.title.toLowerCase().includes(q));
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
        values.includes(String(r[field as keyof FakeItem])),
      );
    }
  }

  if (params.after) {
    result = result.filter((r) => {
      const d = r[params.sortField as keyof FakeItem] as string;
      return d > params.after!;
    });
    return { data: result.slice(0, params.limit), hasMore: false };
  }

  if (params.before) {
    result = result.filter((r) => {
      const d = r[params.sortField as keyof FakeItem] as string;
      return d < params.before!;
    });
    const sliced = result.slice(0, params.limit);
    return { data: sliced, hasMore: result.length > params.limit };
  }

  const sliced = result.slice(0, params.limit);
  const facets = [
    {
      key: "status",
      label: "Status",
      items: statuses.map((s) => ({
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

  return { data: sliced, hasMore: result.length > params.limit, facets };
};

export const accessDocDeck = createDeck<FakeItem>("doc-deck", {
  topic: "Documents",
  rowKey: "id",
  dateFields: [
    { key: "created", label: "Created" },
    { key: "updated", label: "Updated" },
  ],
  pollInterval: 10000,
  pageSize: 15,
  fetch: fakeFetch(docData),
});

export const accessNoteDeck = createDeck<FakeItem>("note-deck", {
  topic: "Notes",
  rowKey: "id",
  dateFields: [
    { key: "created", label: "Created" },
    { key: "updated", label: "Updated" },
  ],
  pollInterval: 15000,
  pageSize: 10,
  fetch: fakeFetch(noteData),
});
