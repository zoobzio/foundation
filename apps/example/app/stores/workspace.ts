export const accessExampleWorkspace = createWorkspace("example", {
  layout: {
    columns: 3,
    rows: 1,
    slots: [
      { id: "main-table", position: [0, 0], span: [2, 1] },
      { id: "sidebar", position: [2, 0], span: [1, 1] },
    ],
  },
});
