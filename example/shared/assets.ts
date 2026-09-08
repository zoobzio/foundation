import type {
  BrowserCrumb,
  BrowserFetchParams,
  BrowserFetchResult,
} from "@zoobzio/foundation/types/data/browser";

export const ASSET_KINDS = ["image", "video", "document", "audio"] as const;

export type AssetKind = (typeof ASSET_KINDS)[number];

export type AssetFile = {
  id: string;
  name: string;
  kind: AssetKind;
  size: number;
  uploadedAt: string;
};

/**
 * A node of the asset hierarchy. Folder keys are globally unique — the
 * browser's crumb trail and the tree's expanded keys are flat string sets,
 * so uniqueness per folder (not per level) keeps both unambiguous.
 */
export type AssetFolder = {
  key: string;
  label: string;
  folders: AssetFolder[];
  files: AssetFile[];
};

/**
 * The in-memory "uploads bucket" the assets page browses. Module state is
 * deliberately mutable: delete actions splice it and refetch, standing in
 * for the object store a real app would call.
 */
export const ASSET_ROOT: AssetFolder = {
  key: "",
  label: "Assets",
  folders: [
    {
      key: "photography",
      label: "Photography",
      folders: [
        {
          key: "photography-2024",
          label: "2024",
          folders: [],
          files: [
            { id: "p-2024-01", name: "forge-open-day.jpg", kind: "image", size: 4_508_612, uploadedAt: "2024-06-02T10:12:00" },
            { id: "p-2024-02", name: "quench-test.jpg", kind: "image", size: 3_216_004, uploadedAt: "2024-09-14T15:40:00" },
            { id: "p-2024-03", name: "anvil-closeup.png", kind: "image", size: 8_912_030, uploadedAt: "2024-11-30T09:05:00" },
          ],
        },
        {
          key: "photography-2025",
          label: "2025",
          folders: [],
          files: [
            { id: "p-2025-01", name: "damascus-billet.jpg", kind: "image", size: 5_112_400, uploadedAt: "2025-02-11T11:00:00" },
            { id: "p-2025-02", name: "workshop-pan.mp4", kind: "video", size: 182_450_009, uploadedAt: "2025-03-22T17:25:00" },
          ],
        },
      ],
      files: [
        { id: "p-cover", name: "portfolio-cover.jpg", kind: "image", size: 2_890_114, uploadedAt: "2025-01-05T08:30:00" },
      ],
    },
    {
      key: "branding",
      label: "Branding",
      folders: [
        {
          key: "branding-logos",
          label: "Logos",
          folders: [],
          files: [
            { id: "b-logo-svg", name: "sigil.svg", kind: "image", size: 18_212, uploadedAt: "2024-01-19T12:00:00" },
            { id: "b-logo-dark", name: "sigil-dark.png", kind: "image", size: 204_800, uploadedAt: "2024-01-19T12:02:00" },
            { id: "b-logo-light", name: "sigil-light.png", kind: "image", size: 198_442, uploadedAt: "2024-01-19T12:03:00" },
          ],
        },
      ],
      files: [
        { id: "b-guide", name: "brand-guidelines.pdf", kind: "document", size: 6_442_450, uploadedAt: "2024-02-02T14:45:00" },
        { id: "b-anthem", name: "hammer-anthem.mp3", kind: "audio", size: 9_120_556, uploadedAt: "2024-05-27T19:10:00" },
      ],
    },
    {
      key: "documents",
      label: "Documents",
      folders: [],
      files: [
        { id: "d-price", name: "price-sheet.pdf", kind: "document", size: 341_002, uploadedAt: "2025-04-01T09:00:00" },
        { id: "d-care", name: "blade-care.md", kind: "document", size: 4_120, uploadedAt: "2025-04-18T16:20:00" },
        { id: "d-terms", name: "commission-terms.pdf", kind: "document", size: 512_330, uploadedAt: "2025-05-06T10:30:00" },
      ],
    },
  ],
  files: [
    { id: "r-readme", name: "readme.md", kind: "document", size: 1_204, uploadedAt: "2024-01-02T09:00:00" },
  ],
};

const resolveFolder = (path: string[]): AssetFolder | undefined => {
  let node: AssetFolder = ASSET_ROOT;
  for (const key of path) {
    const next = node.folders.find((folder) => folder.key === key);
    if (!next) return undefined;
    node = next;
  }
  return node;
};

/**
 * The crumb trail from the root to a key — what the browser's `open` calls
 * need to jump the trail to a tree selection. A folder key resolves to its
 * own trail; a file id resolves to its containing folder's trail.
 */
export const assetTrail = (key: string): BrowserCrumb[] | undefined => {
  const walk = (
    node: AssetFolder,
    trail: BrowserCrumb[],
  ): BrowserCrumb[] | undefined => {
    if (node.files.some((file) => file.id === key)) return trail;
    for (const folder of node.folders) {
      const next = [...trail, { key: folder.key, label: folder.label }];
      if (folder.key === key) return next;
      const found = walk(folder, next);
      if (found) return found;
    }
    return undefined;
  };
  return key === ASSET_ROOT.key ? [] : walk(ASSET_ROOT, []);
};

const compareFiles = (
  field: string,
  direction: "asc" | "desc",
): ((a: AssetFile, b: AssetFile) => number) => {
  const flip = direction === "desc" ? -1 : 1;
  return (a, b) => {
    if (field === "size") return (a.size - b.size) * flip;
    if (field === "uploadedAt")
      return a.uploadedAt.localeCompare(b.uploadedAt) * flip;
    if (field === "kind") return a.kind.localeCompare(b.kind) * flip;
    return a.name.localeCompare(b.name) * flip;
  };
};

/**
 * The assets "backend": resolves one folder level for the browser widget.
 * Folder order doesn't matter — the browser service re-sorts folders
 * alphabetically itself; file order is this function's contract.
 */
export const listAssets = async (
  params: BrowserFetchParams,
): Promise<BrowserFetchResult<AssetFile>> => {
  const folder = resolveFolder(params.path) ?? ASSET_ROOT;
  const files = [...folder.files];
  if (params.sortField)
    files.sort(compareFiles(params.sortField, params.sortDirection));
  return {
    folders: folder.folders.map((child) => ({
      key: child.key,
      label: child.label,
      count: child.files.length,
    })),
    files,
  };
};

/** Deletes files by id anywhere in the hierarchy. */
export const removeAssetFiles = (ids: Set<string>): void => {
  const walk = (node: AssetFolder): void => {
    node.files = node.files.filter((file) => !ids.has(file.id));
    node.folders.forEach(walk);
  };
  walk(ASSET_ROOT);
};
