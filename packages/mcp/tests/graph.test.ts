import { fileURLToPath } from "node:url";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { loadCatalog } from "../src/catalog.ts";
import { buildGraph, discoverRoots, findTargets, nearMatches } from "../src/graph.ts";
import { parseFile } from "../src/scan.ts";
import type { Graph } from "../src/types.ts";

const layerDir = fileURLToPath(new URL("../../..", import.meta.url)).replace(
  /\/$/,
  "",
);
const fixtureDir = fileURLToPath(
  new URL("./fixtures/consumer", import.meta.url),
);
const catalog = loadCatalog();

function fixtureGraph(): Graph {
  const roots = discoverRoots(layerDir, fixtureDir);
  return buildGraph(roots, catalog);
}

describe("parseFile", () => {
  it("reads imports, type imports, re-exports, and exports from TS", () => {
    const facts = parseFile(
      "x.ts",
      [
        'import type { A } from "./a";',
        'import B, { c as d } from "./b";',
        'export { e } from "./e";',
        'export * from "./f";',
        "export const g = 1;",
        "export default g;",
      ].join("\n"),
    );
    expect(facts.imports).toEqual([
      { specifier: "./a", line: 1, kind: "type", locals: ["A"] },
      { specifier: "./b", line: 2, kind: "import", locals: ["B", "d"] },
      { specifier: "./e", line: 3, kind: "import", locals: [] },
      { specifier: "./f", line: 4, kind: "import", locals: [] },
    ]);
    expect(facts.exports).toEqual(["e", "* from ./f", "g", "default"]);
  });

  it("maps SFC template tags (pascal and kebab) back to their imports", () => {
    const facts = parseFile(
      "x.vue",
      [
        "<template>",
        "  <div>",
        "    <Button />",
        "    <the-badge />",
        "  </div>",
        "</template>",
        "",
        '<script setup lang="ts">',
        'import Button from "./button.vue";',
        'import TheBadge from "./TheBadge.vue";',
        "</script>",
      ].join("\n"),
    );
    expect(facts.renders).toEqual([
      { specifier: "./button.vue", tag: "Button", line: 3 },
      { specifier: "./TheBadge.vue", tag: "the-badge", line: 4 },
    ]);
    // Script-setup import lines are file-relative, not block-relative.
    expect(facts.imports.map((i) => i.line)).toEqual([9, 10]);
  });
});

describe("discoverRoots", () => {
  it("includes the consumer app when it has a nuxt config", () => {
    const roots = discoverRoots(layerDir, fixtureDir);
    expect(roots.map((r) => r.name)).toEqual(["foundation", "fixture-app"]);
    expect(roots[1]!.scanDirs).toEqual(["app"]);
  });

  it("omits the consumer when cwd is the layer itself", () => {
    const roots = discoverRoots(layerDir, layerDir);
    expect(roots.map((r) => r.name)).toEqual(["foundation"]);
  });
});

describe("buildGraph across layer and consumer", () => {
  const graph = fixtureGraph();
  const page = join(fixtureDir, "app/pages/index.vue");
  const layerButton = join(layerDir, "app/components/common/button.vue");

  it("resolves package subpath imports from the consumer into the layer", () => {
    const node = graph.nodes.get(page);
    expect(node).toBeDefined();
    expect(node!.root).toBe("fixture-app");
    const edge = node!.outgoing.find((e) => e.to === layerButton);
    expect(edge).toBeDefined();
    expect(edge!.refs).toEqual([
      { line: 3, kind: "render" },
      { line: 9, kind: "import" },
    ]);
  });

  it("resolves ~/ and relative consumer imports", () => {
    const node = graph.nodes.get(page)!;
    const targets = node.outgoing.map((e) => e.to);
    expect(targets).toContain(join(fixtureDir, "app/components/TheBadge.vue"));
    expect(targets).toContain(join(fixtureDir, "app/composables/greeting.ts"));
  });

  it("records type-only edges from consumer into layer type contracts", () => {
    const greeting = graph.nodes.get(
      join(fixtureDir, "app/composables/greeting.ts"),
    )!;
    const edge = greeting.outgoing.find((e) =>
      e.to.endsWith("app/types/common/button.ts"),
    );
    expect(edge).toBeDefined();
    expect(edge!.refs[0]!.kind).toBe("type");
  });

  it("flags unresolvable imports instead of dropping them", () => {
    const broken = graph.nodes.get(
      join(fixtureDir, "app/composables/broken.ts"),
    )!;
    expect(broken.unresolved).toEqual([{ specifier: "./missing", line: 2 }]);
  });

  it("annotates layer nodes with catalog identity", () => {
    const button = graph.nodes.get(layerButton)!;
    expect(button.root).toBe("foundation");
    expect(button.catalog?.entry.name).toBe("button");
    expect(button.catalog?.entry.tier).toBe("common");
    expect(button.importPath).toBe(
      "@zoobzio/foundation/components/common/button.vue",
    );
  });

  it("keeps framework imports as externals without traversing them", () => {
    const select = graph.nodes.get(
      join(layerDir, "app/components/core/select.vue"),
    )!;
    const externals = select.externals.map((e) => e.specifier);
    expect(externals).toContain("#imports");
    expect(externals).toContain("vue");
  });
});

describe("findTargets", () => {
  const graph = fixtureGraph();

  it("matches catalog components, including name collisions across tiers", () => {
    const targets = findTargets(graph, catalog, "select");
    const labels = targets.map((t) => t.label);
    expect(labels).toContain("common/select");
    expect(labels).toContain("core/select");
  });

  it("narrows with a tier qualifier", () => {
    const targets = findTargets(graph, catalog, "core/select");
    expect(targets.map((t) => t.label)).toEqual(["core/select"]);
  });

  it("matches consumer modules by basename and by path name", () => {
    const byBase = findTargets(graph, catalog, "TheBadge");
    expect(byBase).toHaveLength(1);
    expect(byBase[0]!.files).toEqual([
      join(fixtureDir, "app/components/TheBadge.vue"),
    ]);
    const byPath = findTargets(graph, catalog, "pages/index");
    expect(byPath.some((t) => t.files[0] === join(fixtureDir, "app/pages/index.vue"))).toBe(true);
  });

  it("matches exported symbol names", () => {
    const targets = findTargets(graph, catalog, "useGreeting");
    expect(targets).toHaveLength(1);
    expect(targets[0]!.files).toEqual([
      join(fixtureDir, "app/composables/greeting.ts"),
    ]);
    expect(targets[0]!.label).toContain("exports `useGreeting`");
    const layerSymbol = findTargets(graph, catalog, "defineSelect");
    expect(layerSymbol.some((t) => t.files[0]!.endsWith("app/definitions/select.ts"))).toBe(true);
  });

  it("does not match modules by their default export", () => {
    expect(findTargets(graph, catalog, "default")).toHaveLength(0);
  });

  it("suggests near matches by name and by export substring", () => {
    const near = nearMatches(graph, "useGreet");
    expect(near.some((n) => n.includes("composables/greeting"))).toBe(true);
  });

  it("groups every file of a catalog entry into one target", () => {
    const [target] = findTargets(graph, catalog, "core/select");
    expect(target!.files).toContain(
      join(layerDir, "app/components/core/select.vue"),
    );
    expect(target!.files).toContain(join(layerDir, "app/types/core/select.ts"));
    expect(target!.files).toContain(join(layerDir, "app/definitions/select.ts"));
  });
});

describe("cross-provenance usages", () => {
  it("reports the consumer page as a call site of the layer button", () => {
    const graph = fixtureGraph();
    const [target] = findTargets(graph, catalog, "common/button");
    const buttonFile = join(layerDir, "app/components/common/button.vue");
    const incoming = graph.incoming.get(buttonFile) ?? [];
    const froms = incoming.map((e) => graph.nodes.get(e.from)!.root);
    expect(target).toBeDefined();
    expect(froms).toContain("fixture-app");
    expect(froms).toContain("foundation");
  });
});
