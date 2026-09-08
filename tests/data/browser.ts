import type { BrowserFolder } from "../../app/types/data/browser";
import type {
  ActionDescriptor,
  DataTableColumn,
} from "../../app/types/data/table";

export type FakeFile = {
  id: number;
  name: string;
  size: number;
  modified: string;
};

export const fakeFileColumns: DataTableColumn<FakeFile>[] = [
  { key: "name", label: "Name", type: "text", sortable: true },
  { key: "size", label: "Size", type: "filesize", sortable: true },
  { key: "modified", label: "Modified", type: "date" },
];

// Midday timestamps parse as local time, keeping formatted dates stable
// across the timezone the suite runs in.
export const fakeFiles: FakeFile[] = [
  { id: 1, name: "logo.svg", size: 2048, modified: "2025-01-15T12:00:00" },
  { id: 2, name: "hero.png", size: 1048576, modified: "2025-02-20T12:00:00" },
  { id: 3, name: "notes.md", size: 512, modified: "2025-03-10T12:00:00" },
];

/** Deliberately unsorted — the service re-sorts alphabetically. */
export const fakeFolders: BrowserFolder[] = [
  { key: "media", label: "Media", count: 12 },
  { key: "archive", label: "Archive", icon: "layers" },
  { key: "drafts", label: "Drafts" },
];

export const fakeFileActions: Record<string, ActionDescriptor> = {
  download: { icon: "download", label: "Download" },
  delete: { icon: "delete", label: "Delete" },
};

export const fakeFolderActions: Record<string, ActionDescriptor> = {
  rename: { icon: "edit", label: "Rename" },
};

export const fakeBrowserBulkActions: Record<string, ActionDescriptor> = {
  deleteSelected: { icon: "delete", label: "Delete Selected" },
};
