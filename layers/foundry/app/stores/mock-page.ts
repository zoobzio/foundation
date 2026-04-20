type MockPageWidgets = DefineWidgets<{
  "main-table": DataTableSnapshot;
}>;

type MockPageConfig = BasePageConfig<MockPageWidgets>;

export const accessMockPageStore = createPageStore<MockPageConfig>("mock", {
  layout: {
    type: "grid",
    columns: 3,
    rows: 3,
    slots: [
      { id: "main-table", position: [0, 0], span: [2, 2] },
      { id: "sidebar", position: [2, 0], span: [1, 2] },
      { id: "bottom-bar", position: [0, 2], span: [3, 1] },
    ],
  },
  persist: {
    load: async (pageId) => {
      const raw = localStorage.getItem(`page-${pageId}`);
      return raw ? JSON.parse(raw) : null;
    },
    save: async (pageId, config) => {
      localStorage.setItem(`page-${pageId}`, JSON.stringify(config));
    },
    debounce: 1000,
  },
});
