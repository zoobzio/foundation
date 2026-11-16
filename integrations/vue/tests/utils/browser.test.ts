import { describe, expect, it } from "vitest";
import { crumbItems, listingSummary, sortItems } from "../../src/utils/browser";
import { makeBrowser } from "#test/mount/browser";

describe("crumbItems", () => {
  it("starts at the root crumb with index zero", () => {
    const { service } = makeBrowser({ rootLabel: "Assets" });
    expect(crumbItems(service)).toEqual([
      { key: "", label: "Assets", index: 0 },
    ]);
  });

  it("indexes each trail crumb for navigate", () => {
    const { service, state } = makeBrowser();
    state.path = [
      { key: "media", label: "Media" },
      { key: "2025", label: "2025" },
    ];
    expect(crumbItems(service)).toEqual([
      { key: "", label: "Home", index: 0 },
      { key: "media", label: "Media", index: 1 },
      { key: "media/2025", label: "2025", index: 2 },
    ]);
  });

  it("carries a crumb's link onto its item", () => {
    const { service, state } = makeBrowser({ rootLink: { to: "/files" } });
    state.path = [
      { key: "media", label: "Media", link: { to: "/files/media" } },
      { key: "2025", label: "2025" },
    ];
    expect(crumbItems(service)).toEqual([
      { key: "", label: "Home", index: 0, link: { to: "/files" } },
      { key: "media", label: "Media", index: 1, link: { to: "/files/media" } },
      { key: "media/2025", label: "2025", index: 2 },
    ]);
  });
});

describe("sortItems", () => {
  it("lists the sortable columns by their sort field", () => {
    const { service } = makeBrowser({
      columns: [
        { key: "name", label: "Name", sortable: true, sortKey: "title" },
        { key: "size", label: "Size", type: "filesize", sortable: true },
        { key: "modified", label: "Modified", type: "date" },
      ],
    });
    expect(sortItems(service)).toEqual([
      { key: "title", label: "Name" },
      { key: "size", label: "Size" },
    ]);
  });
});

describe("listingSummary", () => {
  it("counts the folders and files the folder shows", async () => {
    const { service } = makeBrowser();
    expect(listingSummary(service)).toBe("0 folders, 0 files");
    await service.init();
    expect(listingSummary(service)).toBe("3 folders, 3 files");
  });

  it("names one of each in the singular", async () => {
    const { service } = makeBrowser(
      {},
      {},
      {
        folders: [{ key: "a", label: "A" }],
        files: [{ id: 1, name: "a", size: 1, modified: "2025-01-01T12:00:00" }],
      },
    );
    await service.init();
    expect(listingSummary(service)).toBe("1 folder, 1 file");
  });
});
