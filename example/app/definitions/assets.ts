import type { AssetFile } from "#shared/assets";

import { defineEntity } from "@zoobzio/foundation/definitions/entity";

import { ASSET_KINDS } from "#shared/assets";

const asset = defineEntity<AssetFile>();

/**
 * The assets browser as data: file columns (exercising the filesize type),
 * plus all three action surfaces — per-file, per-folder, and bulk over the
 * file selection. Handlers attach at `useBrowser` on the page.
 */
export const ASSETS_BROWSER = asset.defineBrowser({
  fileKey: "id",
  rootLabel: "Assets",
  columns: [
    { key: "name", label: "Name", type: "text", sortable: true },
    {
      key: "kind",
      label: "Kind",
      type: "enum",
      enumValues: [...ASSET_KINDS],
      sortable: true,
    },
    { key: "size", label: "Size", type: "filesize", sortable: true },
    { key: "uploadedAt", label: "Uploaded", type: "date", sortable: true },
  ],
  actions: {
    download: { icon: "download", label: "Download" },
    remove: { icon: "delete", label: "Delete" },
  },
  folderActions: {
    rename: { icon: "edit", label: "Rename" },
  },
  bulkActions: {
    removeSelected: { icon: "delete", label: "Delete selected" },
  },
});
