// The asset browser of the example: a browser over a fake backend, a tree
// in memory that `fetch` reads. The search is the current folder's: `fetch`
// matches the text and the filters against the files and folders at `path`
// and no deeper, which is the browser's own grain, as a search is dropped
// on leaving the folder it was typed in.
import type {
  BrowserFetchParams,
  BrowserFetchResult,
  BrowserFolder,
} from "@zoobzio/browser";

import { createBrowser } from "@zoobzio/nuxt/factories/browser";

export type Asset = {
  id: string;
  name: string;
  kind: "Image" | "Document" | "Video" | "Archive";
  size: number;
  modified: string;
  owner: string;
};

type Folder = {
  key: string;
  label: string;
  folders: Folder[];
  files: Asset[];
};

const DAY = 86_400_000;

/** A day a number of days back from today, as an ISO date. */
const ago = (days: number): string =>
  new Date(Date.now() - days * DAY).toISOString().slice(0, 10);

let serial = 0;

const file = (
  name: string,
  kind: Asset["kind"],
  size: number,
  days: number,
  owner: string,
): Asset => ({
  id: String(++serial),
  name,
  kind,
  size,
  modified: ago(days),
  owner,
});

const folder = (
  key: string,
  label: string,
  folders: Folder[] = [],
  files: Asset[] = [],
): Folder => ({ key, label, folders, files });

const root: Folder = folder(
  "",
  "Assets",
  [
    folder(
      "brand",
      "Brand",
      [
        folder(
          "logos",
          "Logos",
          [],
          [
            file("logo-mark.svg", "Image", 4_210, 2, "Ada"),
            file("logo-wordmark.svg", "Image", 6_480, 2, "Ada"),
            file("logo-mono.png", "Image", 38_400, 40, "Grace"),
          ],
        ),
        folder("type", "Typefaces", [], []),
      ],
      [
        file("guidelines.pdf", "Document", 2_480_000, 12, "Ada"),
        file("palette.png", "Image", 184_000, 30, "Grace"),
        file("voice-and-tone.md", "Document", 9_300, 5, "Linus"),
      ],
    ),
    folder(
      "campaigns",
      "Campaigns",
      [
        folder(
          "spring",
          "Spring launch",
          [],
          [
            file("hero.png", "Image", 1_920_000, 1, "Grace"),
            file("hero@2x.png", "Image", 5_760_000, 1, "Grace"),
            file("teaser.mp4", "Video", 48_200_000, 3, "Linus"),
            file("brief.pdf", "Document", 310_000, 20, "Ada"),
          ],
        ),
        folder(
          "archive",
          "Archive",
          [],
          [file("2024-campaigns.zip", "Archive", 912_000_000, 200, "Linus")],
        ),
      ],
      [file("calendar.pdf", "Document", 96_000, 8, "Ada")],
    ),
    folder(
      "press",
      "Press kit",
      [],
      [
        file("press-kit.zip", "Archive", 64_000_000, 15, "Linus"),
        file("founders.jpg", "Image", 3_400_000, 60, "Grace"),
        file("fact-sheet.pdf", "Document", 120_000, 15, "Ada"),
        file("b-roll.mp4", "Video", 220_000_000, 45, "Linus"),
      ],
    ),
  ],
  [
    file("readme.md", "Document", 2_100, 0, "Ada"),
    file("favicon.png", "Image", 1_800, 90, "Grace"),
    file("showreel.mp4", "Video", 128_000_000, 7, "Linus"),
    file("licenses.pdf", "Document", 74_000, 120, "Ada"),
    file("backup-q1.zip", "Archive", 402_000_000, 33, "Linus"),
  ],
);

/** The folder at a key trail, or the root where the trail leads nowhere. */
const at = (path: string[]): Folder => {
  let here = root;
  for (const key of path) {
    const next = here.folders.find((f) => f.key === key);
    if (!next) return root;
    here = next;
  }
  return here;
};

/** A size as the search takes it: megabytes, into bytes. */
const megabytes = (value: string): number => Number(value) * 1_000_000;

/** Every file at or below a folder. */
const within = (from: Folder): Asset[] => [
  ...from.files,
  ...from.folders.flatMap(within),
];

/**
 * What a folder shows in the files' columns: the bytes of everything
 * below it under `size`, and its latest change under `modified`, where it
 * holds a file at all.
 */
const summary = (from: Folder): Partial<Asset> => {
  const assets = within(from);
  if (!assets.length) return { size: 0 };
  return {
    size: assets.reduce((total, asset) => total + asset.size, 0),
    modified: assets
      .map((asset) => asset.modified)
      .sort()
      .at(-1),
  };
};

/** The fields the backend sorts by, by the sort field a column names. */
const SORTS: Record<string, keyof Asset | undefined> = {
  name: "name",
  kind: "kind",
  size: "size",
  modified: "modified",
};

/** The order of two values of a column: numbers by size, the rest as text. */
const compare = (x: unknown, y: unknown): number =>
  typeof x === "number" && typeof y === "number"
    ? x - y
    : String(x ?? "").localeCompare(String(y ?? ""));

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The backend's read: the folders and files at `path`, narrowed by the
 * search and sorted. Nothing below `path` is searched.
 */
const fetch = async ({
  path,
  sortField,
  sortDirection,
  query,
  filters,
}: BrowserFetchParams): Promise<BrowserFetchResult<Asset>> => {
  await pause(150);
  const here = at(path);
  const term = query.trim().toLowerCase();

  const files = here.files.filter((asset) => {
    if (term && !asset.name.toLowerCase().includes(term)) return false;
    return filters.every(({ key, op, value }) => {
      switch (key) {
        case "name":
          return asset.name.toLowerCase().includes(value.toLowerCase());
        case "kind":
          return asset.kind === value;
        case "owner":
          return asset.owner === value;
        case "size":
          return op === "under"
            ? asset.size < megabytes(value)
            : asset.size > megabytes(value);
        case "modified":
          if (op === "before") return asset.modified < value;
          if (op === "after") return asset.modified > value;
          return asset.modified === value;
        default:
          return true;
      }
    });
  });

  const field = SORTS[sortField ?? ""];
  const sign = sortDirection === "asc" ? 1 : -1;
  if (field) {
    files.sort((a, b) => compare(a[field], b[field]) * sign);
  }

  // A column filter is about files, so it leaves the folders out; free
  // text matches a folder by its name.
  const folders: BrowserFolder<Asset>[] = filters.length
    ? []
    : here.folders
        .filter((f) => !term || f.label.toLowerCase().includes(term))
        .map((f) => ({
          key: f.key,
          label: f.label,
          values: summary(f),
        }));

  // The folders sort as the files do: by name under the name column, by
  // what they show under another, and by name where they show nothing or
  // nothing sorts.
  folders.sort((a, b) => {
    const byName = a.label.localeCompare(b.label);
    if (!field) return byName;
    if (field === "name") return byName * sign;
    return compare(a.values?.[field], b.values?.[field]) * sign || byName;
  });

  return { folders, files: [...files] };
};

/** Drops files from the tree by id, wherever they are. */
const drop = (ids: Set<string>, from: Folder = root): void => {
  from.files = from.files.filter((asset) => !ids.has(asset.id));
  for (const child of from.folders) drop(ids, child);
};

/** Drops the folders of one folder by key, with everything below them. */
const dropFolders = (keys: Set<string>, from: Folder): void => {
  from.folders = from.folders.filter((f) => !keys.has(f.key));
};

export const useAssets = createBrowser<Asset>("assets", {
  fileKey: "id",
  rootLabel: "Assets",
  columns: [
    { key: "name", label: "Name", type: "text", sortable: true },
    {
      key: "kind",
      label: "Kind",
      type: "enum",
      sortable: true,
      values: ["Image", "Document", "Video", "Archive"],
    },
    {
      key: "size",
      label: "Size",
      type: "filesize",
      sortable: true,
      operators: ["over", "under"],
      defaultOperator: "over",
    },
    {
      key: "modified",
      label: "Modified",
      type: "date",
      sortable: true,
      operators: ["on", "before", "after"],
      defaultOperator: "on",
    },
    {
      key: "owner",
      label: "Owner",
      type: "text",
      values: ["Ada", "Grace", "Linus"],
    },
  ],
  fetch,
  actions: {
    remove: {
      label: "Delete",
      icon: "remove",
      action: (asset) => {
        drop(new Set([asset.id]));
        useAssets().fetch();
      },
    },
  },
  bulkActions: {
    remove: {
      label: "Delete",
      icon: "remove",
      action: (selected, folders) => {
        const assets = useAssets();
        // Folder keys are the current folder's: they are selected in it.
        dropFolders(new Set(folders), at(assets.pathKeys));
        drop(new Set(selected));
        assets.clearSelection();
        assets.fetch();
      },
    },
  },
});
