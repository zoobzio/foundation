import { describe, it, expect } from "vitest";
import { extractStrings, extractImports, fileToRoute, collectFile, resolveImport, walkImports, buildPageMap, type FileEntry } from "../src/extract";
import { hashText } from "../src/hash";
import type { SourceMap } from "../src/types";

describe("extractStrings", () => {
  it("extracts double-quoted $t calls", () => {
    expect(extractStrings('$t("Save changes")')).toEqual(["Save changes"]);
  });

  it("extracts single-quoted $t calls", () => {
    expect(extractStrings("$t('Cancel')")).toEqual(["Cancel"]);
  });

  it("extracts multiple calls", () => {
    expect(extractStrings('$t("Hello") + $t("World")')).toEqual(["Hello", "World"]);
  });

  it("extracts calls with interpolation params", () => {
    expect(extractStrings('$t("Hello {name}", { name: user })')).toEqual(["Hello {name}"]);
  });

  it("returns empty array when no $t calls", () => {
    expect(extractStrings('const x = translate("nope")')).toEqual([]);
  });

  it("handles Vue templates", () => {
    expect(extractStrings('<span>{{ $t("Submit") }}</span>')).toEqual(["Submit"]);
  });

  it("handles whitespace", () => {
    expect(extractStrings('$t(  "Spaced"  )')).toEqual(["Spaced"]);
  });
});

describe("extractImports", () => {
  it("extracts relative imports", () => {
    expect(extractImports('import Foo from "./Foo.vue"')).toEqual(["./Foo.vue"]);
  });

  it("extracts named imports", () => {
    expect(extractImports('import { bar } from "../utils/bar"')).toEqual(["../utils/bar"]);
  });

  it("ignores package imports", () => {
    expect(extractImports('import { ref } from "vue"')).toEqual([]);
  });

  it("extracts multiple relative imports", () => {
    const code = 'import A from "./A";\nimport B from "./B";';
    expect(extractImports(code)).toEqual(["./A", "./B"]);
  });
});

describe("fileToRoute", () => {
  it("maps page files to route paths", () => {
    expect(fileToRoute("/app/pages/settings.vue")).toBe("/settings");
  });

  it("maps index pages to root", () => {
    expect(fileToRoute("/app/pages/index.vue")).toBe("/");
  });

  it("maps nested pages", () => {
    expect(fileToRoute("/app/pages/admin/users.vue")).toBe("/admin/users");
  });

  it("maps dynamic routes", () => {
    expect(fileToRoute("/app/pages/users/[id].vue")).toBe("/users/:id");
  });

  it("returns undefined for non-page files", () => {
    expect(fileToRoute("/app/components/Header.vue")).toBeUndefined();
  });
});

describe("collectFile", () => {
  it("populates source map and returns hashes", () => {
    const sourceMap: SourceMap = {};
    const entry = collectFile(["Save"], ["./Foo"], sourceMap);
    const hash = hashText("Save");
    expect(sourceMap[hash]).toBe("Save");
    expect(entry.hashes).toEqual([hash]);
    expect(entry.imports).toEqual(["./Foo"]);
  });

  it("deduplicates hashes within a file", () => {
    const sourceMap: SourceMap = {};
    const entry = collectFile(["Save", "Save"], [], sourceMap);
    expect(entry.hashes).toHaveLength(1);
  });
});

describe("resolveImport", () => {
  it("resolves sibling import", () => {
    expect(resolveImport("/app/components/Foo.vue", "./Bar.vue")).toBe("/app/components/Bar.vue");
  });

  it("resolves parent import", () => {
    expect(resolveImport("/app/pages/admin/users.vue", "../utils/auth")).toBe("/app/pages/utils/auth");
  });
});

describe("walkImports", () => {
  it("collects hashes from direct file", () => {
    const h = hashText("Hello");
    const fileMap: Record<string, FileEntry> = {
      "/pages/index.vue": { hashes: [h], imports: [] },
    };
    expect(walkImports("/pages/index.vue", fileMap, new Set())).toEqual([h]);
  });

  it("walks imports recursively", () => {
    const h1 = hashText("Page");
    const h2 = hashText("Component");
    const fileMap: Record<string, FileEntry> = {
      "/pages/index.vue": { hashes: [h1], imports: ["./Comp.vue"] },
      "/pages/Comp.vue": { hashes: [h2], imports: [] },
    };
    const result = walkImports("/pages/index.vue", fileMap, new Set());
    expect(result).toContain(h1);
    expect(result).toContain(h2);
  });

  it("handles circular imports", () => {
    const h = hashText("A");
    const fileMap: Record<string, FileEntry> = {
      "/a.vue": { hashes: [h], imports: ["./b.vue"] },
      "/b.vue": { hashes: [], imports: ["./a.vue"] },
    };
    const result = walkImports("/a.vue", fileMap, new Set());
    expect(result).toEqual([h]);
  });

  it("resolves imports with extension matching", () => {
    const h = hashText("Util");
    const fileMap: Record<string, FileEntry> = {
      "/pages/index.vue": { hashes: [], imports: ["../utils/helper"] },
      "/utils/helper.ts": { hashes: [h], imports: [] },
    };
    const result = walkImports("/pages/index.vue", fileMap, new Set());
    expect(result).toContain(h);
  });
});

describe("buildPageMap", () => {
  it("attributes component hashes to the page that imports them", () => {
    const hPage = hashText("Page text");
    const hComp = hashText("Button label");
    const fileMap: Record<string, FileEntry> = {
      "/app/pages/index.vue": { hashes: [hPage], imports: ["../components/Btn.vue"] },
      "/app/components/Btn.vue": { hashes: [hComp], imports: [] },
    };
    const pageMap = buildPageMap(fileMap);
    expect(pageMap["/"]).toContain(hPage);
    expect(pageMap["/"]).toContain(hComp);
  });

  it("attributes shared component to all pages that use it", () => {
    const hShared = hashText("Shared");
    const fileMap: Record<string, FileEntry> = {
      "/app/pages/index.vue": { hashes: [], imports: ["../components/Nav.vue"] },
      "/app/pages/about.vue": { hashes: [], imports: ["../components/Nav.vue"] },
      "/app/components/Nav.vue": { hashes: [hShared], imports: [] },
    };
    const pageMap = buildPageMap(fileMap);
    expect(pageMap["/"]).toContain(hShared);
    expect(pageMap["/about"]).toContain(hShared);
  });

  it("puts unreachable hashes in __common", () => {
    const hOrphan = hashText("Orphan");
    const fileMap: Record<string, FileEntry> = {
      "/app/pages/index.vue": { hashes: [], imports: [] },
      "/app/layouts/default.vue": { hashes: [hOrphan], imports: [] },
    };
    const pageMap = buildPageMap(fileMap);
    expect(pageMap["__common"]).toContain(hOrphan);
  });

  it("deduplicates hashes per page", () => {
    const h = hashText("Dup");
    const fileMap: Record<string, FileEntry> = {
      "/app/pages/index.vue": { hashes: [h], imports: ["../components/A.vue"] },
      "/app/components/A.vue": { hashes: [h], imports: [] },
    };
    const pageMap = buildPageMap(fileMap);
    const count = pageMap["/"].filter((x: string) => x === h).length;
    expect(count).toBe(1);
  });

  it("walks deep import chains", () => {
    const hDeep = hashText("Deep");
    const fileMap: Record<string, FileEntry> = {
      "/app/pages/index.vue": { hashes: [], imports: ["../components/A.vue"] },
      "/app/components/A.vue": { hashes: [], imports: ["./B.vue"] },
      "/app/components/B.vue": { hashes: [], imports: ["../utils/c"] },
      "/app/utils/c.ts": { hashes: [hDeep], imports: [] },
    };
    const pageMap = buildPageMap(fileMap);
    expect(pageMap["/"]).toContain(hDeep);
  });
});
