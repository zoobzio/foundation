import type { BrowserColumn, BrowserFolder } from "@zoobzio/browser";

export type FakeFile = {
  id: number;
  name: string;
  size: number;
};

export const fakeFileColumns: BrowserColumn<FakeFile>[] = [
  { key: "name", label: "Name", type: "text", sortable: true },
  { key: "size", label: "Size", type: "filesize", sortable: true },
];

export const fakeFiles: FakeFile[] = [
  { id: 1, name: "logo.svg", size: 2048 },
  { id: 2, name: "hero.png", size: 1048576 },
];

/** In the order a fetch returns them, which is the order they render in. */
export const fakeFolders: BrowserFolder[] = [
  { key: "archive", label: "Archive" },
  { key: "media", label: "Media", count: 12 },
];
