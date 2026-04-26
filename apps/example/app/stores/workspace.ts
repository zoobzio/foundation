export const accessExampleWorkspace = createWorkspace("example", {
  layout: {
    columns: 3,
    rows: 3,
    slots: [
      { id: "main-table", position: [0, 0], span: [2, 3] },
      { id: "chart-breakdown", position: [2, 0], span: [1, 1] },
      { id: "chart-series", position: [2, 1], span: [1, 1] },
      { id: "chart-distribution", position: [2, 2], span: [1, 1] },
    ],
  },
});
