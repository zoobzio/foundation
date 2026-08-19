import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { loadCatalog } from "../src/catalog.ts";
import { buildGraph, discoverRoots } from "../src/graph.ts";
import { healthReport } from "../src/health.ts";
import type { Catalog } from "../src/types.ts";

const layerDir = fileURLToPath(new URL("../../..", import.meta.url)).replace(
  /\/$/,
  "",
);
const fixtureDir = fileURLToPath(
  new URL("./fixtures/consumer", import.meta.url),
);
const catalog = loadCatalog();
const graph = buildGraph(discoverRoots(layerDir, fixtureDir), catalog);
const report = healthReport(graph, catalog);

describe("healthReport", () => {
  it("summarizes the scan by root with error and warning counts", () => {
    expect(report).toMatch(/^# Foundation health/);
    expect(report).toMatch(/Scanned \d+ modules \(foundation \d+, fixture-app \d+\) — \d+ errors, \d+ warnings\./);
  });

  it("surfaces parse errors", () => {
    expect(report).toContain("## Parse errors");
    expect(report).toMatch(/composables\/unparsable/);
  });

  it("surfaces unresolved imports with specifier and line", () => {
    expect(report).toContain("## Unresolved imports");
    expect(report).toMatch(/composables\/broken.*`\.\/missing` L2/);
  });

  it("reports the fixture import cycle as one finding", () => {
    expect(report).toContain("## Import cycles");
    expect(report).toMatch(
      /- 2 modules \(fixture-app\): app\/composables\/cycle-a\.ts ⇄ app\/composables\/cycle-b\.ts/,
    );
  });

  it("finds no tier layering violations in the real layer", () => {
    expect(report).not.toContain("Tier layering violations");
    expect(healthReport(graph, catalog, "layering")).toContain("No findings.");
  });

  it("flags orphan consumer modules as dead-code candidates", () => {
    expect(report).toContain("## Dead-code candidates");
    expect(report).toMatch(/composables\/broken.*no importers/);
  });

  it("does not flag pages or layer public modules as dead code", () => {
    const section = healthReport(graph, catalog, "dead-code");
    expect(section).not.toMatch(/pages\/index/);
    expect(section).not.toMatch(/\(foundation\)/);
  });

  it("flags components imported by an SFC but never rendered", () => {
    expect(report).toContain("## Imported but never rendered");
    expect(report).toMatch(/pages\/index.*imports.*components\/Unused.*never renders/);
    // Rendered imports must not be flagged.
    expect(report).not.toMatch(/imports.*TheBadge.*never renders/);
  });

  it("lists blast-radius hotspots", () => {
    expect(report).toContain("## Blast-radius hotspots");
    expect(report).toMatch(/— \d+ transitive dependents/);
  });

  it("measures catalog adoption from the consumer root", () => {
    expect(report).toContain("## Catalog adoption");
    expect(report).toMatch(/\d+ of \d+ components imported directly by fixture-app\./);
    // index.vue imports button.vue and greeting.ts type-imports its props.
    expect(report).toContain("Most used: common/button (2)");
    expect(report).toMatch(/Never imported: .*core\/select/);
  });

  it("renders a single section when filtered", () => {
    const section = healthReport(graph, catalog, "cycles");
    expect(section).toContain("# Foundation health — Import cycles");
    expect(section).toContain("cycle-a");
    expect(section).not.toContain("Unresolved imports");
  });

  it("detects catalog drift against a stale catalog", () => {
    const doctored: Catalog = {
      ...catalog,
      components: [
        ...catalog.components,
        {
          name: "ghost",
          tier: "core",
          components: ["app/components/core/ghost.vue"],
          types: [],
          definition: null,
          factory: null,
          elements: null,
        },
      ],
    };
    const section = healthReport(graph, doctored, "catalog-drift");
    expect(section).toMatch(/core\/ghost — app\/components\/core\/ghost\.vue missing/);
    // The real catalog must be drift-free.
    expect(report).not.toContain("Catalog drift");
  });
});
