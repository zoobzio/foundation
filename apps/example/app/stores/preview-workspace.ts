export const accessPreviewWorkspace = createWorkspace("preview", {
  layout: {
    columns: 3,
    rows: 2,
    slots: [
      { id: "preview", position: [0, 0], span: [2, 2] },
      { id: "doc-deck", position: [2, 0], span: [1, 1] },
      { id: "note-deck", position: [2, 1], span: [1, 1] },
    ],
  },
});
